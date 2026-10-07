# MongoDB Associate Developer Exam — Study Guide

> Built from the official exam guide + MongoDB docs + what candidates report from the real exam.
> Examples use **mongosh** syntax unless stated otherwise. Driver examples (Section 6) are shown in **Node.js** and **Python**, with quick notes for Java, C# and PHP.
>
> 🎯 **My exam language: Node.js.** Section 6 (18%) will be asked with the Node.js driver. See **Section 6B — Node.js Driver Deep Dive** and the Node.js practice questions in **8B**. You can skim the Python/Java/C#/PHP snippets.

---

## 0. Exam at a glance

| Item | Detail |
|---|---|
| Questions | 53 scored (+ a few unscored, unidentified) |
| Time | 75 minutes (~85 s per question) |
| Types | Multiple choice (1 correct) and multiple response (2–3 correct — the prompt tells you how many) |
| Fee | USD $150 |
| Delivery | Online, proctored (ProctorU). No reference material. |
| Driver languages | Pick one at registration: Node.js, Python, Java, C#, PHP. Only Section 6 changes. |
| Passing score | Not published. Only the **overall** score matters, not per-domain. |
| Retake | If you fail, you must wait **15 days** and pay again. Completing a learning path gives a 50% discount code. |
| Expiry | Certifications currently don't expire. |

### Where the points are (prioritize in this order)

| Section | Weight | ≈ Questions |
|---|---|---|
| 2. CRUD (incl. aggregation + Atlas Search) | **51%** | ~27 |
| 6. Drivers | **18%** | ~10 |
| 3. Indexes | **17%** | ~9 |
| 1. Overview & Document Model | 8% | ~4 |
| 4. Data Modeling | 4% | ~2 |
| 5. Tools | 2% | ~1 |

**Takeaway:** CRUD + Drivers + Indexes = **86%** of the exam. If you master query semantics (what documents a query matches) and the driver syntax for your language, you pass.

> ⚠️ Candidates report ~3 questions on **Atlas Search indexes** that most third-party practice tests don't cover. Don't skip section 2.18–2.19.

---

## 1. MongoDB Overview & the Document Model (8%)

### 1.1 BSON value types

BSON = Binary JSON. It supports more types than JSON.

| Type | Example in mongosh | Notes |
|---|---|---|
| Double | `3.14` | Default number type in mongosh |
| String | `"hello"` | UTF-8 |
| Object (embedded document) | `{ city: "CDMX" }` | |
| Array | `[1, "a", { x: 1 }]` | Can mix types |
| Binary data | `BinData(0, "...")` | |
| ObjectId | `ObjectId("65f...")` | 12 bytes: timestamp + random + counter |
| Boolean | `true` | |
| Date | `ISODate("2026-10-07")` / `new Date()` | Milliseconds since epoch |
| Null | `null` | |
| Regular expression | `/^abc/i` | |
| JavaScript | `Code("function(){}")` | |
| 32-bit integer | `NumberInt(5)` | |
| Timestamp | `Timestamp(...)` | Internal use (oplog) |
| 64-bit integer | `NumberLong(5)` | |
| Decimal128 | `NumberDecimal("9.99")` | Use for money |
| MinKey / MaxKey | `MinKey()` / `MaxKey()` | Compare lower/higher than everything |

Deprecated: `undefined`, `DBPointer`, `Symbol`.

**Common wrong answers (NOT BSON types):** Set, Tuple, Enum, Char/Character, Float (as a separate type), Map, Struct, Pointer, BigDecimal, DateTime-with-timezone.

### 1.2 Documents of different shapes in one collection

MongoDB has a **flexible schema**: documents in the same collection can have different fields and different types for the same field.

```js
{ _id: 1, name: "Ana", age: 30 }
{ _id: 2, name: "Luis", email: "l@x.com", tags: ["vip"] }
{ _id: 3, fullName: { first: "Eva", last: "Ruiz" }, age: "unknown" }
```
✅ All three can co-exist.

They **cannot** co-exist if:
- Two have the **same `_id`** (`_id` must be unique in a collection).
- A **schema validation rule** (`$jsonSchema`) on the collection rejects one.
- A **unique index** on a field is violated.

### Document rules you should know
- Every document has an `_id`. If you don't provide one, the driver/server creates an `ObjectId`.
- `_id` is **immutable** (can't be changed by an update) and can be any type except an array.
- Max document size: **16 MB**.
- Max nesting depth: 100 levels.
- Field order is preserved; `_id` is always first.
- Hierarchy: **cluster → database → collection → document → field**.

---

## 2. CRUD (51%) — the most important section

Sample collection used in examples:

```js
db.inventory.insertMany([
  { _id: 1, item: "journal",  qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { _id: 2, item: "notebook", qty: 50, tags: ["red", "blank"], size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
  { _id: 3, item: "paper",    qty: 100, tags: ["red", "blank", "plain"], size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
  { _id: 4, item: "planner",  qty: 75, tags: ["blank", "red"], size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
  { _id: 5, item: "postcard", qty: 45, tags: ["blue"], size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
])
```

### 2.1 Insert

```js
db.users.insertOne({ name: "Ana", age: 30 })
// { acknowledged: true, insertedId: ObjectId("...") }

db.users.insertMany([{ name: "A" }, { name: "B" }])
// { acknowledged: true, insertedIds: { '0': ObjectId(...), '1': ObjectId(...) } }
```

**Properly vs improperly formed — what to look for:**

| Command | OK? | Why |
|---|---|---|
| `insertOne({ a: 1 })` | ✅ | |
| `insertOne([{ a: 1 }, { a: 2 }])` | ❌ | insertOne takes a single document |
| `insertMany({ a: 1 })` | ❌ | insertMany requires an **array** |
| `insertMany([{ a: 1 }, { a: 2 }])` | ✅ | |
| `insertOne({ name: "x", born: ISODate("1990-01-01") })` | ✅ | Date type |
| `insertOne({ name: x })` | ❌ | `x` is an undefined variable (unquoted string) |
| `insertOne({ "address.city": "CDMX" })` | ⚠️ | Avoid: dots in field names are not treated as nested; use `{ address: { city: "CDMX" } }` |
| `insertOne({ _id: 1 })` twice | ❌ 2nd fails | `E11000 duplicate key error` |

**Ordered vs unordered `insertMany`:**
```js
db.c.insertMany([{ _id: 1 }, { _id: 1 }, { _id: 2 }])                      // ordered (default): stops at the error → only _id:1 inserted
db.c.insertMany([{ _id: 1 }, { _id: 1 }, { _id: 2 }], { ordered: false })  // continues → _id:1 and _id:2 inserted
```

If the collection or database doesn't exist, the insert **creates it**.

### 2.2 Replacing a whole document (no update operators)

Use `replaceOne(filter, replacement)`. The **entire document is replaced** — every field not in the replacement is **gone** — but `_id` is kept.

```js
// before: { _id: 1, item: "journal", qty: 25, tags: [...], size: {...}, status: "A" }
db.inventory.replaceOne({ _id: 1 }, { item: "journal", qty: 30 })
// { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
// after:  { _id: 1, item: "journal", qty: 30 }   ← tags, size, status removed
```

Gotchas:
- The replacement **cannot contain update operators** (`$set`, etc.) → error.
- `updateOne(filter, { qty: 30 })` (no operator) → **error** in mongosh/modern drivers ("Update document requires atomic operators"). Replacement must use `replaceOne`.
- Replacement with a **different `_id`** → error (immutable field).
- Filter matches nothing → `matchedCount: 0`, no change (unless `upsert: true`).
- Replaced with identical content → `matchedCount: 1, modifiedCount: 0`.

### 2.3 Update with `$set` (and other operators)

`$set` changes only the listed fields; it **creates** the field if missing.

```js
db.inventory.updateOne({ _id: 1 }, { $set: { qty: 30, "size.uom": "mm", color: "red" } })
// qty changed, size.uom changed (other size fields kept), color added
```

**Dot notation** matters:
```js
{ $set: { "size.h": 20 } }   // changes only size.h — w and uom kept
{ $set: { size: { h: 20 } } } // REPLACES the whole size object → w and uom are lost
```

**Update operators cheat sheet:**

| Operator | Effect | Example |
|---|---|---|
| `$set` | Set value (creates if missing) | `{ $set: { status: "B" } }` |
| `$unset` | Remove field | `{ $unset: { color: "" } }` |
| `$inc` | Add (creates with that value if missing) | `{ $inc: { qty: -2 } }` |
| `$mul` | Multiply (missing → 0) | `{ $mul: { price: 1.1 } }` |
| `$rename` | Rename field | `{ $rename: { qty: "quantity" } }` |
| `$min` / `$max` | Set only if smaller / larger | `{ $max: { highScore: 90 } }` |
| `$currentDate` | Set to now | `{ $currentDate: { lastModified: true } }` |
| `$setOnInsert` | Set only when an upsert inserts | see 2.4 |
| `$push` | Append to array (dupes allowed) | `{ $push: { tags: "new" } }` |
| `$push` + `$each` | Append many | `{ $push: { tags: { $each: ["a", "b"] } } }` |
| `$addToSet` | Append only if not present | `{ $addToSet: { tags: "red" } }` |
| `$pull` | Remove matching elements | `{ $pull: { tags: "red" } }` |
| `$pop` | Remove first (`-1`) or last (`1`) | `{ $pop: { tags: 1 } }` |
| `$` (positional) | First array element matched by filter | `updateOne({ grades: 80 }, { $set: { "grades.$": 82 } })` |
| `$[]` | All elements | `{ $inc: { "grades.$[]": 5 } }` |
| `$[elem]` + `arrayFilters` | Elements matching condition | `{ $set: { "grades.$[g]": 100 } }, { arrayFilters: [{ g: { $gte: 95 } }] }` |

`$push` on a field that isn't an array → error. `$push` on a missing field → creates an array.

### 2.4 Upsert

"Update if exists, insert if not."

```js
db.inventory.updateOne(
  { item: "eraser" },                                    // filter
  { $set: { qty: 10 }, $setOnInsert: { status: "A" } },  // update
  { upsert: true }
)
// If no "eraser" exists, inserts: { _id: ObjectId(...), item: "eraser", qty: 10, status: "A" }
// result: { matchedCount: 0, modifiedCount: 0, upsertedId: ObjectId(...), upsertedCount: 1 }
```

Key rules:
- The inserted document = **equality fields from the filter** + fields from the update.
- Range conditions in the filter (`{ qty: { $gt: 5 } }`) are **not** copied into the new document.
- `$setOnInsert` fields are only applied on insert, ignored on update.
- `replaceOne(filter, doc, { upsert: true })` also works.
- `upsert` is an **option (3rd argument)**, not part of the update document. `updateOne({ ... }, { $set: {...}, upsert: true })` is wrong.

### 2.5 Update many documents

```js
db.inventory.updateMany({ qty: { $lt: 50 } }, { $set: { reorder: true } })
// { matchedCount: 2, modifiedCount: 2 }   (journal 25, postcard 45)

db.inventory.updateMany({}, { $inc: { qty: 1 } })   // every document
```

`updateOne` only touches the **first** match. The second argument must use update operators (or be an aggregation pipeline in `[...]`).

### 2.6 `findAndModify` / `findOneAndUpdate` and concurrency

These **find one document and modify it atomically**, returning the document.

```js
db.counters.findAndModify({
  query: { _id: "orderId" },
  update: { $inc: { seq: 1 } },
  new: true,          // return the doc AFTER the update (default false = BEFORE)
  upsert: true
})

// modern equivalents
db.counters.findOneAndUpdate({ _id: "orderId" }, { $inc: { seq: 1 } }, { returnNewDocument: true })
db.c.findOneAndReplace(filter, replacement)
db.c.findOneAndDelete(filter)   // returns the deleted doc
```

**Default returns the original (pre-update) document.** This is a favorite exam detail.

| API | Option to get the updated doc |
|---|---|
| mongosh `findAndModify` | `new: true` |
| mongosh `findOneAndUpdate` | `returnNewDocument: true` |
| Node.js driver | `{ returnDocument: "after" }` |
| Python | `return_document=ReturnDocument.AFTER` |
| Java | `new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER)` |
| C# | `new FindOneAndUpdateOptions<T> { ReturnDocument = ReturnDocument.After }` |

**Concurrency scenarios:**
- Single-document writes are **atomic**. If two clients run `findAndModify` with `$inc: { seq: 1 }` on the same doc at the same time, **both increments apply** (seq goes up by 2) and each client gets a **different** value. No lost update.
- The find and the modify happen as one operation: no other write can sneak in between them for that document. If another operation changes the doc first so it no longer matches the filter, `findAndModify` matches nothing (returns `null`) or the next matching doc.
- ⚠️ With `upsert: true` and **no unique index** on the filter field, two concurrent calls can **both insert** → duplicate documents. A unique index prevents this (one gets a duplicate key error/retries).
- Contrast with a non-atomic "read then write" in application code (`find` → compute → `updateOne`), which **can** lose updates.

### 2.7 Delete

```js
db.inventory.deleteOne({ status: "D" })   // deletes the FIRST match only → { deletedCount: 1 }
db.inventory.deleteMany({ status: "D" })  // all matches          → { deletedCount: 2 }
db.inventory.deleteMany({})               // all docs; collection AND indexes remain
db.inventory.drop()                       // removes collection + its indexes
db.inventory.findOneAndDelete({ item: "paper" })  // returns deleted doc
```

To delete one **specific** document, filter by `_id` (or another unique field). `deleteOne({})` deletes an arbitrary first document.

### 2.8 Simple equality lookup

```js
db.inventory.findOne({ item: "journal" })   // returns one document or null
db.inventory.find({ item: "journal" })      // returns a cursor
db.inventory.find({ "size.uom": "in" })     // nested field: dot notation, must be QUOTED
```

Equality on an **embedded document** requires an exact match, including **field order**:
```js
db.inventory.find({ size: { h: 14, w: 21, uom: "cm" } })   // matches _id 1
db.inventory.find({ size: { w: 21, h: 14, uom: "cm" } })   // matches NOTHING (different order)
```

### 2.9 Equality on array fields

```js
db.inventory.find({ tags: "red" })              // array CONTAINS "red" → 1,2,3,4
db.inventory.find({ tags: ["red", "blank"] })   // EXACT array, exact order → only 2
db.inventory.find({ tags: { $all: ["red", "blank"] } })  // contains both, any order → 1,2,3,4
db.inventory.find({ "tags.0": "red" })          // first element is "red" → 2,3
db.inventory.find({ tags: { $size: 3 } })       // array has exactly 3 elements → 3
```

**This is heavily tested.** Scalar value = "contains"; array value = "exact match".

### 2.10 Relational (comparison) operators

`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`

```js
db.inventory.find({ qty: { $gt: 45, $lte: 75 } })   // 50, 75 → _id 2, 4
db.inventory.find({ "size.h": { $lt: 10 } })        // 8.5 → 2, 3
```

Gotchas:
- `$ne` and `$nin` **also match documents where the field is missing**.
- **Type bracketing:** `{ qty: { $gt: 20 } }` only compares against numbers; a document with `qty: "30"` (string) does **not** match.
- `{ x: null }` matches docs where `x` is `null` **or missing**. Use `{ x: { $exists: false } }` for missing only, `{ x: { $type: "null" } }` for null only.
- **Ranges on arrays** — each condition can be satisfied by a **different element**:
  ```js
  // doc: { scores: [70, 90] }
  db.c.find({ scores: { $gt: 80, $lt: 85 } })   // MATCHES (90 > 80, 70 < 85)
  db.c.find({ scores: { $elemMatch: { $gt: 80, $lt: 85 } } })  // no match (no single element in range)
  ```

### 2.11 `$in` / `$nin`

```js
db.inventory.find({ status: { $in: ["A", "D"] } })        // status is A or D
db.inventory.find({ tags: { $in: ["blue", "plain"] } })   // array contains ANY of them → 3, 5
db.inventory.find({ item: { $in: [/^p/, "journal"] } })   // regex allowed in $in
db.inventory.find({ status: { $nin: ["A"] } })            // not A, OR field missing
```

`$in` is preferable to many `$or` conditions on the **same** field.

### 2.12 `$elemMatch`

Requires that **a single array element** satisfies **all** conditions.

```js
// grades: [ { grade: "A", score: 95 }, { grade: "B", score: 70 } ]
db.students.find({ grades: { $elemMatch: { grade: "B", score: { $gt: 90 } } } })  // NO match
db.students.find({ "grades.grade": "B", "grades.score": { $gt: 90 } })            // MATCH (different elements)
```

Rule: **dot notation** = conditions may be met by different elements; **`$elemMatch`** = same element.

`$elemMatch` is also a projection operator (returns only the first matching element).

### 2.13 Logical operators

| Operator | Meaning |
|---|---|
| implicit (comma) | AND |
| `$and: [ ... ]` | AND (explicit) |
| `$or: [ ... ]` | OR |
| `$nor: [ ... ]` | none of them (matches missing fields too) |
| `$not: { ... }` | negates an operator expression; matches missing fields too |

```js
db.inventory.find({ status: "A", qty: { $lt: 30 } })                         // AND → 1
db.inventory.find({ $or: [{ status: "D" }, { qty: { $lt: 30 } }] })          // 1, 3, 4
db.inventory.find({ status: "A", $or: [{ qty: { $lt: 30 } }, { item: /^p/ }] })  // 1, 5
db.inventory.find({ qty: { $not: { $gt: 50 } } })                            // qty <= 50 OR qty missing
```

**When you NEED explicit `$and`:** when you repeat the same key/operator, because a JS/JSON object cannot have duplicate keys (the **last one wins**):

```js
// ❌ second $or overwrites the first
db.c.find({ $or: [{ a: 1 }, { b: 1 }], $or: [{ c: 1 }, { d: 1 }] })
// ✅
db.c.find({ $and: [ { $or: [{ a: 1 }, { b: 1 }] }, { $or: [{ c: 1 }, { d: 1 }] } ] })

// ❌ only qty < 70 is applied
db.c.find({ qty: { $gt: 20 }, qty: { $lt: 70 } })
// ✅
db.c.find({ qty: { $gt: 20, $lt: 70 } })
```

Other useful query operators: `$exists`, `$type`, `$regex`, `$expr` (compare two fields: `{ $expr: { $gt: ["$spent", "$budget"] } }`).

### 2.14 Sort, skip, limit

```js
db.inventory.find().sort({ qty: -1 }).limit(2)   // 100 (paper), 75 (planner)
db.inventory.find().sort({ status: 1, qty: -1 }) // by status asc, then qty desc within each status
```

Key rules:
- `1` = ascending, `-1` = descending.
- The server always applies **sort → skip → limit**, regardless of the order you chain them. `.limit(2).sort({qty:1})` = `.sort({qty:1}).limit(2)`.
- Without `sort`, order is **not guaranteed** (natural order).
- Missing fields sort as `null` → they come **first** ascending.
- Mixed types sort by BSON order: **MinKey < Null < Numbers < String < Object < Array < BinData < ObjectId < Boolean < Date < Timestamp < Regex < MaxKey**.
- Ascending sort on an array field uses the array's **smallest** element; descending uses the **largest**.
- Sort with ties is not deterministic → add `_id` as a tiebreaker for stable paging.

### 2.15 Projection (spot the INCORRECT one)

```js
db.inventory.find({}, { item: 1, qty: 1 })          // ✅ item, qty, _id
db.inventory.find({}, { item: 1, _id: 0 })          // ✅ item only (_id is the one exception)
db.inventory.find({}, { tags: 0, size: 0 })         // ✅ everything except tags, size
db.inventory.find({}, { "size.uom": 1 })            // ✅ nested field
db.inventory.find({}, { item: 1, status: 0 })       // ❌ ERROR: cannot mix inclusion & exclusion
db.inventory.find({}, { tags: { $slice: 1 } })      // ✅ first array element
db.inventory.find({ tags: "red" }, { "tags.$": 1 }) // ✅ positional: first matched element
```

**The #1 rule:** you can't mix `1` and `0` in the same projection **except for `_id: 0`**. `_id` is included by default.

### 2.16 Cursors — getting all results

`find()` returns a **cursor**, not an array.

```js
const cursor = db.inventory.find()
cursor.toArray()                    // all results as an array
cursor.forEach(doc => printjson(doc))
while (cursor.hasNext()) { printjson(cursor.next()) }
```

- mongosh shows the first **20** documents; type **`it`** to iterate more.
- Cursors are fetched in **batches** (`batchSize`).
- Idle cursors time out after **10 minutes** on the server.
- Drivers: Node `await cursor.toArray()` or `for await (const doc of cursor)`; Python `list(cursor)` or `for doc in cursor`.

### 2.17 Counting

```js
db.inventory.countDocuments({ status: "A" })   // ✅ accurate, accepts a filter → 3
db.inventory.countDocuments({})                // ✅ count all (accurate)
db.inventory.estimatedDocumentCount()          // ✅ fast, uses metadata, NO filter
db.inventory.aggregate([{ $match: { status: "A" } }, { $count: "total" }])  // ✅ { total: 3 }
db.inventory.find({ status: "A" }).count()     // ⚠️ deprecated (works in mongosh, avoid)
db.inventory.count()                           // ⚠️ deprecated
```

### 2.18 Atlas Search — creating a search index

Atlas Search is full-text search (built on Apache Lucene) — **different** from a regular index and from the legacy `text` index.

**Dynamic mapping** (index all fields automatically):
```json
{
  "mappings": { "dynamic": true }
}
```

**Static mapping** (only specific fields):
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title":  { "type": "string" },
      "plot":   { "type": "string", "analyzer": "lucene.english" },
      "genres": { "type": "string" },
      "title_ac": { "type": "autocomplete" }
    }
  }
}
```

Ways to create:
```js
// mongosh (Atlas, or MongoDB 7.0+/8.x with search enabled)
db.movies.createSearchIndex("default", { mappings: { dynamic: true } })
db.movies.getSearchIndexes()
db.movies.dropSearchIndex("default")
```
```js
// Node.js
await movies.createSearchIndex({ name: "default", definition: { mappings: { dynamic: true } } });
```
```python
# Python
from pymongo.operations import SearchIndexModel
movies.create_search_index(SearchIndexModel(definition={"mappings": {"dynamic": True}}, name="default"))
```
Also via the Atlas UI (Search tab → Create Search Index → Visual or JSON editor) and the Atlas CLI (`atlas clusters search indexes create`).

- Default index name is **`default`**.
- `createIndex({ title: "text" })` creates a **legacy text index**, NOT an Atlas Search index — a common distractor.
- **Autocomplete** queries require a field mapped with `type: "autocomplete"`.

### 2.19 Atlas Search — queries

`$search` is an **aggregation stage** and must be the **first stage** in the pipeline.

```js
db.movies.aggregate([
  { $search: {
      index: "default",
      text: { query: "space adventure", path: "plot" }
  }},
  { $limit: 5 },
  { $project: { title: 1, score: { $meta: "searchScore" } } }
])
```

Common operators:

| Operator | Use | Example |
|---|---|---|
| `text` | Analyzed full-text | `text: { query: "dog", path: "plot" }` |
| `text` + fuzzy | Typos | `text: { query: "dgo", path: "plot", fuzzy: { maxEdits: 1 } }` (maxEdits 1 or 2) |
| `phrase` | Exact phrase / word order | `phrase: { query: "new york", path: "plot" }` |
| `autocomplete` | Search-as-you-type | `autocomplete: { query: "star w", path: "title" }` |
| `compound` | Combine clauses | see below |
| `range` | Numbers/dates | `range: { path: "year", gte: 2000, lte: 2010 }` |
| `wildcard` / `regex` | Patterns | `wildcard: { query: "star*", path: "title", allowAnalyzedField: true }` |
| `equals` | Exact (bool, ObjectId, number, date) | `equals: { path: "released", value: true }` |

```js
{ $search: {
  compound: {
    must:    [{ text: { query: "war", path: "plot" } }],          // required, affects score
    mustNot: [{ text: { query: "comedy", path: "genres" } }],     // excluded
    should:  [{ range: { path: "year", gte: 2000 } }],            // optional, boosts score
    filter:  [{ text: { query: "English", path: "languages" } }]  // required, does NOT affect score
  }
}}
```

- `path` can be a string, an array of fields, or `{ wildcard: "*" }`.
- `$searchMeta` returns only metadata (counts, facets), not documents.
- Results are sorted by relevance score by default.
- (Bonus) `$vectorSearch` is for semantic/vector search with a `vectorSearch`-type index — know that it exists.

### 2.20 Aggregation: `$match` + `$group`

An aggregation is an **array of stages**; each stage's output feeds the next.

```js
// orders: { _id, cust: "A", amount: 10, status: "paid" } ...
db.orders.aggregate([
  { $match: { status: "paid" } },                     // filter (same syntax as find)
  { $group: {
      _id: "$cust",                                   // group key — "$" prefix = field reference
      total: { $sum: "$amount" },
      count: { $sum: 1 },
      avg:   { $avg: "$amount" },
      items: { $push: "$item" }
  }},
  { $sort: { total: -1 } }
])
```

Worked example:
```
orders:
{ cust: "A", amount: 10, status: "paid" }
{ cust: "A", amount: 20, status: "paid" }
{ cust: "B", amount: 5,  status: "paid" }
{ cust: "B", amount: 50, status: "pending" }

Output:
{ _id: "A", total: 30, count: 2, avg: 15, ... }
{ _id: "B", total: 5,  count: 1, avg: 5,  ... }   ← B's pending order was filtered out
```

Rules:
- `$group` **requires `_id`**. `_id: null` = one group for the whole input (grand total).
- Group by several fields: `_id: { cust: "$cust", year: { $year: "$date" } }`.
- Output contains **only** `_id` + accumulator fields — all other fields are dropped.
- Forgetting `$` (`_id: "cust"`) groups everything into one group whose `_id` is the literal string `"cust"`.
- Accumulators: `$sum`, `$avg`, `$min`, `$max`, `$first`, `$last`, `$push`, `$addToSet`, `$count`.
- `$group` output order is **not guaranteed** — add `$sort` if needed.
- Put `$match` first so it can use indexes and reduce data early.

Other stages to recognize: `$project`, `$addFields`/`$set`, `$unset`, `$sort`, `$limit`, `$skip`, `$unwind`, `$count`, `$sortByCount`, `$facet`, `$bucket`, `$merge`.

`$unwind` turns one doc with an array of N elements into N docs:
```js
{ _id: 1, tags: ["a", "b"] }  →  $unwind: "$tags"  →  { _id: 1, tags: "a" }, { _id: 1, tags: "b" }
```

### 2.21 Aggregation: `$lookup` (left outer join)

```js
// orders: { _id: 1, item: "almonds", qty: 2 }, { _id: 2, item: "pecans", qty: 1 }, { _id: 3, qty: 5 }
// inventory: { sku: "almonds", stock: 120 }, { sku: "pecans", stock: 80 }

db.orders.aggregate([
  { $lookup: {
      from: "inventory",        // collection to join (same database)
      localField: "item",       // field in orders
      foreignField: "sku",      // field in inventory
      as: "inventory_docs"      // output ARRAY field
  }}
])
```
Output:
```js
{ _id: 1, item: "almonds", qty: 2, inventory_docs: [ { _id: ..., sku: "almonds", stock: 120 } ] }
{ _id: 2, item: "pecans",  qty: 1, inventory_docs: [ { _id: ..., sku: "pecans",  stock: 80 } ] }
{ _id: 3, qty: 5, inventory_docs: [ ] }   // see note
```

Rules:
- `as` is **always an array** (even with 0 or 1 match).
- It's a **left outer join**: unmatched input docs are kept with an **empty array**.
- ⚠️ A document **missing** `localField` is treated as `null` and matches foreign docs whose `foreignField` is null/missing.
- Often followed by `$unwind: "$inventory_docs"` to flatten.
- Pipeline form: `{ $lookup: { from, let: { x: "$field" }, pipeline: [ { $match: { $expr: { $eq: ["$sku", "$$x"] } } } ], as } }`.

### 2.22 Aggregation: `$out`

Writes the pipeline results to a collection.

```js
db.orders.aggregate([
  { $group: { _id: "$cust", total: { $sum: "$amount" } } },
  { $out: "customer_totals" }
])
```

Rules:
- `$out` must be the **last** stage.
- It **creates** the collection if it doesn't exist and **completely replaces** it if it does (old docs gone; existing indexes are kept).
- The `aggregate()` call itself returns **no documents** (empty cursor).
- Can write to another database: `{ $out: { db: "reports", coll: "totals" } }`.
- Can't output to a capped collection.
- Need to **merge/upsert** into an existing collection instead of replacing? Use **`$merge`**.

---

## 3. Indexes (17%)

Without an index, MongoDB does a **COLLSCAN** (reads every document). With one, it does an **IXSCAN**.

```js
db.users.createIndex({ email: 1 })                       // single field, ascending
db.users.createIndex({ email: 1 }, { unique: true })     // unique
db.users.createIndex({ lastName: 1, firstName: 1 })      // compound
db.users.getIndexes()
db.users.dropIndex("email_1")                            // by name (field_direction)
db.users.dropIndex({ email: 1 })                         // or by key spec
db.users.dropIndexes()                                   // all except _id
db.users.hideIndex("email_1")                            // test impact before dropping
```

### Index types

| Type | Example | Notes |
|---|---|---|
| Single field | `{ age: 1 }` | Direction doesn't matter for single-field sorts |
| Compound | `{ status: 1, age: -1 }` | Order of fields matters |
| Multikey | `{ tags: 1 }` on an array | Created **automatically** when the field holds an array |
| Text (legacy) | `{ plot: "text" }` | One per collection |
| Hashed | `{ userId: "hashed" }` | Sharding; equality only |
| Geospatial | `{ loc: "2dsphere" }` | |
| Wildcard | `{ "attrs.$**": 1 }` | Unknown/dynamic fields |
| TTL | `{ createdAt: 1 }, { expireAfterSeconds: 3600 }` | Auto-delete docs |
| Partial | `{ ... }, { partialFilterExpression: { qty: { $gt: 10 } } }` | Indexes only some docs |
| Sparse | `{ ... }, { sparse: true }` | Skips docs missing the field |

### 3.1 Which index fixes a collection scan?

Index the fields used in the **filter** (and **sort**).

```js
db.orders.find({ customerId: 42, status: "shipped" }).sort({ date: -1 })
// best: { customerId: 1, status: 1, date: -1 }
```

**ESR rule** for compound indexes: **E**quality fields first, then **S**ort fields, then **R**ange fields.
```js
db.c.find({ status: "A", qty: { $gt: 10 } }).sort({ date: 1 })
// best: { status: 1, date: 1, qty: 1 }   (E, S, R)
```

**Prefix rule:** index `{ a: 1, b: 1, c: 1 }` supports queries on `a`, `a+b`, `a+b+c`. It does **not** efficiently support `b` alone or `c` alone or `b+c`.

### 3.2 Equality on an array field

```js
db.inventory.find({ tags: "red" })   // COLLSCAN
db.inventory.createIndex({ tags: 1 }) // a regular index on the array field → becomes MULTIKEY automatically
```

There's no special "multikey" syntax — you create a normal index. Limitation: a compound index can't include **two** fields that are both arrays in the same document.

### 3.3 No filter, sort on two fields

```js
db.c.find().sort({ a: 1, b: -1 })
```
Supported by an index with the **same directions** or the **exact inverse**:
- ✅ `{ a: 1, b: -1 }`
- ✅ `{ a: -1, b: 1 }` (inverse — traversed backwards)
- ❌ `{ a: 1, b: 1 }` (mixed mismatch)
- ❌ `{ b: -1, a: 1 }` (wrong field order)

Without a supporting index → in-memory **SORT** stage (blocking; 100 MB memory limit unless `allowDiskUse`).

### 3.4 How many indexes exist?

```js
db.users.getIndexes()
```
**Always count the default `_id` index** — every collection has it and it can't be dropped. A collection where you created 2 indexes has **3**.

### 3.5 Trade-offs

Benefits: faster reads, efficient sorts, enforce uniqueness, covered queries.

Costs:
- **Slower writes** — every insert/update/delete must update every affected index.
- Use **disk and RAM** (indexes ideally fit in memory — the working set).
- Unused/redundant indexes are pure overhead. `{ a: 1 }` is redundant if `{ a: 1, b: 1 }` exists.
- Low-selectivity fields (e.g. boolean) give little benefit.

Dropping an index that supports queries → those queries fall back to **COLLSCAN** (slower, more CPU/IO), sorts become in-memory, and a **unique** constraint disappears. Writes get slightly faster. Use `hideIndex()` to test first.

### 3.6 Reading `explain()` output

```js
db.orders.find({ customerId: 42 }).explain("executionStats")
```

| Look at | Good sign | Bad sign |
|---|---|---|
| `winningPlan.stage` | `IXSCAN` (often under `FETCH`) | **`COLLSCAN`** = no index used |
| `SORT` stage present | — | in-memory sort (no index for the sort) |
| `totalDocsExamined` vs `nReturned` | close to each other | examined ≫ returned |
| `totalKeysExamined` | ≈ `nReturned` | ≫ `nReturned` |
| `executionTimeMillis` | low | high |
| `PROJECTION_COVERED` / `totalDocsExamined: 0` | **covered query** (answered from the index only) | — |

Verbosity modes: `"queryPlanner"` (default; no execution), `"executionStats"`, `"allPlansExecution"`. `rejectedPlans` lists alternatives the planner didn't pick.

**Covered query:** all filter and projected fields are in the index and `_id` is excluded:
```js
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "a@x.com" }, { name: 1, _id: 0 })   // covered
```

---

## 4. Data Modeling (4%)

Golden rule: **data that is accessed together should be stored together.** Model for your application's queries, not for normalization.

### Embed vs reference

| Embed when... | Reference (link) when... |
|---|---|
| One-to-one or one-to-**few** | One-to-**many** that can grow large, or **unbounded** |
| Child data is always read with the parent | Child data is often accessed on its own |
| Child doesn't make sense without the parent ("contains") | Many-to-many relationships |
| You want atomic single-document updates | Data is large or updated frequently and independently |
| | Embedding would risk the 16 MB limit |

### 4.1 Parent + two children + the user (typical scenario)

Example: a **blog post** (parent), its **tags** (child 1), its **comments** (child 2), and **users**.

```js
// posts
{
  _id: 1,
  title: "Intro to MongoDB",
  authorId: ObjectId("u1"),           // LINK to users (users exist independently)
  tags: ["mongodb", "nosql"],          // EMBED (few, small, always read with the post)
  commentCount: 1342
}

// comments — LINK (can be unbounded, paged separately)
{ _id: ..., postId: 1, userId: ObjectId("u7"), text: "Great!", date: ... }

// users — separate collection, referenced
{ _id: ObjectId("u1"), name: "Ana", email: "..." }
```

Same idea: customer → addresses (embed, few) + orders (link, many); product → specs (embed) + reviews (link, unbounded; maybe embed the 10 most recent = **subset pattern**).

### 4.2 Anti-patterns (recognize these)

| Anti-pattern | Example | Fix |
|---|---|---|
| **Unbounded arrays** | Embedding every comment/log/follower in one doc | Reference; bucket; subset |
| **Bloated documents** | Storing large rarely-used fields with hot data | Split into another collection |
| **Massive number of collections** | One collection per user/day | Use one collection with a field |
| **Unnecessary indexes** | Indexing every field; redundant prefixes | Drop unused/redundant |
| **Separating data accessed together** | Normalizing like SQL, needing `$lookup` on every read | Embed |
| **Case-insensitive queries without a case-insensitive index** | `$regex: /x/i` everywhere | Collation index (strength 1 or 2) |

Useful patterns: **Extended reference** (copy a few frequently-read fields of the referenced doc), **Subset**, **Computed** (store precomputed totals), **Bucket** (group time-series), **Outlier**, **Attribute**, **Polymorphic**, **Schema versioning**.

---

## 5. Tools and Tooling (2%)

### 5.1 Atlas Sample Dataset + Data Explorer

1. In Atlas, open your cluster → **"…" (ellipsis) menu → Load Sample Dataset**.
2. Databases created include `sample_mflix` (movies, comments, users, theaters), `sample_airbnb` (listingsAndReviews), `sample_analytics` (accounts, customers, transactions), `sample_training` (zips, grades, trips, companies…), `sample_supplies` (sales), `sample_restaurants`, `sample_weatherdata`, `sample_geospatial`.
3. Click **Browse Collections** (Data Explorer) → choose database → collection.
4. Type a filter in the **Filter** bar (e.g. `{ title: "Titanic" }`) → **Apply**. Documents show in natural order; the first one listed is the "first document".

Other tools to recognize:
- **mongosh** — the MongoDB Shell (JavaScript REPL).
- **Compass** — GUI (query, aggregation builder, explain plans, indexes, schema analysis).
- **Database Tools** — `mongoimport`/`mongoexport` (JSON/CSV), `mongodump`/`mongorestore` (BSON backups).
- **Atlas CLI** (`atlas ...`), **MongoDB for VS Code** extension.

---

## 6. Drivers (18%)

### 6.1 What is a driver?
An official **client library** for a programming language that lets an application connect to MongoDB and run operations using idiomatic language constructs. It handles connection management/pooling, BSON serialization, authentication, server discovery/monitoring, retryable reads/writes, and failover.

Official drivers: Node.js (`mongodb`), Python (**PyMongo**; async API too), Java (`mongodb-driver-sync`/`reactivestreams`), C#/.NET, PHP (extension + library), Go, Rust, C, C++, Kotlin, Swift, Ruby, Scala.

### 6.2 How the application connects/uses the driver

1. Install the driver (`npm install mongodb`, `pip install pymongo`, Maven/Gradle, NuGet `MongoDB.Driver`, `composer require mongodb/mongodb`).
2. Create **one `MongoClient`** with the connection string.
3. Get a **database** → **collection** handle.
4. Run operations.
5. Close the client when the application shuts down.

**Best practice (frequently tested): create ONE `MongoClient` per application (per cluster) and reuse it.** It's thread-safe and owns the connection pool. Creating a client per request is an anti-pattern.

### 6.3 Connection string (URI)

```
mongodb+srv://myUser:p%40ss@cluster0.ab1cd.mongodb.net/myDb?retryWrites=true&w=majority&appName=MyApp
└──┬──────┘   └──┬─┘ └─┬──┘ └──────────┬──────────────┘ └─┬─┘ └──────────────────┬───────────────────┘
 scheme      user  password        host                default DB          options
```

```
mongodb://user:pass@host1:27017,host2:27017,host3:27017/myDb?replicaSet=rs0&authSource=admin
```

| Component | Notes |
|---|---|
| `mongodb://` | Standard format; list host(s):port; default port **27017** |
| `mongodb+srv://` | DNS **seed list** format (Atlas). Single hostname, **no port**; driver looks up SRV/TXT records; **TLS on by default** |
| `username:password@` | Special characters (`@ : / ? # [ ] %`) must be **percent-encoded** (`@` → `%40`) |
| host[:port] | One or more, comma-separated |
| `/database` | Default database / auth database if `authSource` not given |
| `?options` | `retryWrites=true`, `w=majority`, `appName`, `authSource`, `replicaSet`, `tls=true`, `maxPoolSize`, `minPoolSize`, `connectTimeoutMS`, `readPreference` |

### 6.4 Connection pooling

A **connection pool** is a cache of open, authenticated connections maintained by `MongoClient`. Operations borrow a connection and return it when done.

Advantages:
- Avoids the cost of a new TCP + TLS handshake + authentication per operation → **lower latency**.
- **Reuses** connections; limits the total number of connections to the server.
- Supports **concurrent** operations from many threads/async tasks.

Settings: `maxPoolSize` (default **100**), `minPoolSize` (default 0), `maxIdleTimeMS`, `waitQueueTimeoutMS`. The pool exists per server per `MongoClient` — another reason to have only one client.

### 6.5–6.9 Syntax side by side

#### Connect

```js
// Node.js
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();                 // optional in recent versions (auto-connects)
const coll = client.db("shop").collection("products");
// ...
await client.close();
```
```python
# Python
from pymongo import MongoClient
client = MongoClient(os.environ["MONGODB_URI"])
coll = client["shop"]["products"]       # or client.shop.products
# ...
client.close()
```

#### Insert (6.5)

```js
// Node.js
const r1 = await coll.insertOne({ name: "pen", price: 2 });
r1.insertedId;
const r2 = await coll.insertMany([{ name: "a" }, { name: "b" }]);
r2.insertedCount; r2.insertedIds;
```
```python
# Python
r1 = coll.insert_one({"name": "pen", "price": 2})
r1.inserted_id
r2 = coll.insert_many([{"name": "a"}, {"name": "b"}])
r2.inserted_ids
```

#### Update (6.6)

```js
// Node.js
const r = await coll.updateOne({ name: "pen" }, { $set: { price: 3 } });
r.matchedCount; r.modifiedCount;
await coll.updateMany({ price: { $lt: 5 } }, { $inc: { price: 1 } });
await coll.updateOne({ name: "ink" }, { $set: { price: 9 } }, { upsert: true });  // r.upsertedId
await coll.replaceOne({ name: "pen" }, { name: "pen", price: 4 });
const doc = await coll.findOneAndUpdate({ name: "pen" }, { $inc: { stock: -1 } }, { returnDocument: "after" });
// Driver v6+: returns the document itself (older versions returned { value: doc })
```
```python
# Python
r = coll.update_one({"name": "pen"}, {"$set": {"price": 3}})
r.matched_count, r.modified_count
coll.update_many({"price": {"$lt": 5}}, {"$inc": {"price": 1}})
coll.update_one({"name": "ink"}, {"$set": {"price": 9}}, upsert=True)     # r.upserted_id
coll.replace_one({"name": "pen"}, {"name": "pen", "price": 4})
from pymongo import ReturnDocument
doc = coll.find_one_and_update({"name": "pen"}, {"$inc": {"stock": -1}}, return_document=ReturnDocument.AFTER)
```
> Python: operators must be **quoted strings** (`"$set"`), and options are **keyword arguments** (`upsert=True`).

#### Delete (6.7)

```js
// Node.js
(await coll.deleteOne({ name: "pen" })).deletedCount;
await coll.deleteMany({ discontinued: true });
```
```python
# Python
coll.delete_one({"name": "pen"}).deleted_count
coll.delete_many({"discontinued": True})
```

#### Find (6.8)

```js
// Node.js
const one = await coll.findOne({ name: "pen" });                // document or null
const cursor = coll.find({ price: { $gt: 1 } })                 // NO await: returns a FindCursor
  .project({ name: 1, _id: 0 })
  .sort({ price: -1 })
  .limit(10);
const docs = await cursor.toArray();
for await (const d of coll.find({})) { console.log(d); }
// options form:
await coll.find({ price: { $gt: 1 } }, { projection: { name: 1 }, sort: { price: -1 }, limit: 10 }).toArray();
const n = await coll.countDocuments({ price: { $gt: 1 } });
```
```python
# Python
one = coll.find_one({"name": "pen"})                            # dict or None
cursor = coll.find({"price": {"$gt": 1}}, {"name": 1, "_id": 0}) \
             .sort("price", -1) \
             .limit(10)
# multi-field sort: .sort([("price", -1), ("name", 1)])
docs = list(cursor)
for d in coll.find({}):
    print(d)
n = coll.count_documents({"price": {"$gt": 1}})
```

#### Aggregation (6.9)

```js
// Node.js
const pipeline = [
  { $match: { status: "paid" } },
  { $group: { _id: "$cust", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
];
const results = await coll.aggregate(pipeline).toArray();   // AggregationCursor
```
```python
# Python
pipeline = [
    {"$match": {"status": "paid"}},
    {"$group": {"_id": "$cust", "total": {"$sum": "$amount"}}},
    {"$sort": {"total": -1}},
]
results = list(coll.aggregate(pipeline))                    # CommandCursor
```

#### Java and C# quick reference

```java
// Java (sync driver) — builders: Filters, Updates, Projections, Sorts, Aggregates, Accumulators
MongoClient client = MongoClients.create(uri);
MongoCollection<Document> coll = client.getDatabase("shop").getCollection("products");
coll.insertOne(new Document("name", "pen").append("price", 2));
coll.insertMany(List.of(new Document("name", "a"), new Document("name", "b")));
coll.updateOne(Filters.eq("name", "pen"), Updates.set("price", 3));
coll.updateMany(Filters.lt("price", 5), Updates.inc("price", 1));
coll.updateOne(Filters.eq("name", "ink"), Updates.set("price", 9), new UpdateOptions().upsert(true));
coll.deleteOne(Filters.eq("name", "pen"));
coll.deleteMany(Filters.eq("discontinued", true));
Document one = coll.find(Filters.eq("name", "pen")).first();
List<Document> docs = coll.find(Filters.gt("price", 1)).sort(Sorts.descending("price")).into(new ArrayList<>());
coll.aggregate(List.of(
    Aggregates.match(Filters.eq("status", "paid")),
    Aggregates.group("$cust", Accumulators.sum("total", "$amount"))
)).into(new ArrayList<>());
```

```csharp
// C# (.NET) — Builders<T>, LINQ, async variants end in Async
var client = new MongoClient(uri);
var coll = client.GetDatabase("shop").GetCollection<BsonDocument>("products");
coll.InsertOne(new BsonDocument { { "name", "pen" }, { "price", 2 } });
coll.InsertMany(new[] { doc1, doc2 });
var filter = Builders<BsonDocument>.Filter.Eq("name", "pen");
coll.UpdateOne(filter, Builders<BsonDocument>.Update.Set("price", 3));
coll.UpdateMany(Builders<BsonDocument>.Filter.Lt("price", 5), Builders<BsonDocument>.Update.Inc("price", 1));
coll.UpdateOne(filter, update, new UpdateOptions { IsUpsert = true });
coll.DeleteOne(filter);  coll.DeleteMany(filter);
var one  = coll.Find(filter).FirstOrDefault();
var docs = coll.Find(Builders<BsonDocument>.Filter.Gt("price", 1)).ToList();
var agg  = coll.Aggregate().Match(filter).Group(new BsonDocument { { "_id", "$cust" }, { "total", new BsonDocument("$sum", "$amount") } }).ToList();
```
With C# classes (POCOs) you'll often see `GetCollection<Product>("products")`, `Find(p => p.Price > 1)`, and `[BsonId]`/`[BsonElement("name")]` attributes.

```php
// PHP (library)
$client = new MongoDB\Client($uri);
$coll = $client->shop->products;
$coll->insertOne(['name' => 'pen']);       $coll->insertMany([...]);
$coll->updateOne(['name' => 'pen'], ['$set' => ['price' => 3]], ['upsert' => true]);
$coll->deleteMany(['discontinued' => true]);
$one = $coll->findOne(['name' => 'pen']);  $cursor = $coll->find(['price' => ['$gt' => 1]]);
$coll->aggregate([['$match' => [...]], ['$group' => [...]]]);
```

### 6.10 MQL vs Aggregation syntax in the driver

| | MQL (`find`) | Aggregation (`aggregate`) |
|---|---|---|
| Call | `find(filter, options/projection)` | `aggregate([stage, stage, ...])` |
| Argument | A **filter document** | An **array (list)** of stage documents |
| Filter | the filter itself | `{ $match: filter }` |
| Projection | `projection` option / `.project()` | `{ $project: ... }` stage |
| Sort/limit | cursor methods `.sort()`, `.limit()` | `{ $sort }`, `{ $limit }` stages, order matters |
| Can transform/group/join | No | Yes (`$group`, `$lookup`, `$addFields`…) |
| Returns | Cursor (`FindCursor`) | Cursor (`AggregationCursor` / `CommandCursor`) |
| Field references | plain field names | `"$field"` in expressions |

Equivalent queries:
```js
coll.find({ status: "A" }).sort({ qty: -1 }).limit(5).project({ item: 1 })
coll.aggregate([{ $match: { status: "A" } }, { $sort: { qty: -1 } }, { $limit: 5 }, { $project: { item: 1 } }])
```

### Bonus: transactions (shows up occasionally)

Multi-document ACID transactions require a replica set or sharded cluster (Atlas is fine).

```js
// Node.js
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne({ _id: "A" }, { $inc: { bal: -100 } }, { session });
    await accounts.updateOne({ _id: "B" }, { $inc: { bal: 100 } }, { session });
  });
} finally { await session.endSession(); }
```
```python
# Python
with client.start_session() as s:
    s.with_transaction(lambda s: (
        accounts.update_one({"_id": "A"}, {"$inc": {"bal": -100}}, session=s),
        accounts.update_one({"_id": "B"}, {"$inc": {"bal": 100}}, session=s),
    ))
```
Every operation inside must receive the **session**. Default max runtime: 60 seconds. Single-document operations are already atomic without a transaction.

---

## 6B. Node.js Driver Deep Dive (your exam language)

Package: `mongodb` (`npm install mongodb`). The API is **Promise-based** — use `async/await`. Callbacks were removed in driver v5, so any answer using `coll.insertOne(doc, function(err, res) {...})` is outdated.

### Imports you'll see

```js
const { MongoClient, ObjectId, ServerApiVersion, Decimal128, Long } = require("mongodb");
// or ESM / TypeScript
import { MongoClient, ObjectId } from "mongodb";
```

### Complete connection template (memorize the shape)

```js
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://user:pass@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority&appName=MyApp";

// ONE client for the whole app — it owns the connection pool
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  maxPoolSize: 50,   // default 100
  minPoolSize: 5     // default 0
});

async function run() {
  try {
    await client.connect();                       // optional since v4.7: first operation auto-connects
    await client.db("admin").command({ ping: 1 }); // test the connection
    const db = client.db("shop");                 // sync, no network call
    const products = db.collection("products");   // sync, no network call
    // ... operations ...
  } finally {
    await client.close();                         // close at app shutdown, not after each request
  }
}
run().catch(console.error);
```

Key points:
- `new MongoClient(uri, options)` — options are the **second constructor argument**, or URI query params.
- `client.db()` and `db.collection()` are **synchronous** and don't create anything on the server. The database/collection is created on the first write.
- `client.db()` with no name uses the database in the URI path (or `test`).
- In a web server (Express etc.), create the client **once at startup**, export/reuse it, and never `close()` per request.

### Which calls are awaited?

| Call | Returns | `await`? |
|---|---|---|
| `insertOne`, `insertMany` | `Promise<InsertOneResult / InsertManyResult>` | ✅ |
| `updateOne`, `updateMany`, `replaceOne` | `Promise<UpdateResult>` | ✅ |
| `deleteOne`, `deleteMany` | `Promise<DeleteResult>` | ✅ |
| `findOne` | `Promise<doc \| null>` | ✅ |
| `find` | **`FindCursor`** (sync) | ❌ — await `toArray()` / iterate |
| `aggregate` | **`AggregationCursor`** (sync) | ❌ — await `toArray()` / iterate |
| `cursor.toArray()`, `cursor.next()`, `cursor.hasNext()` | Promise | ✅ |
| `countDocuments`, `estimatedDocumentCount`, `distinct` | Promise | ✅ |
| `findOneAndUpdate/Replace/Delete` | `Promise<doc \| null>` (v6+) | ✅ |
| `createIndex` | `Promise<string>` (index name) | ✅ |
| `listIndexes()` | cursor | ❌ — `await ...toArray()` |
| `client.db()`, `db.collection()` | objects (sync) | ❌ |

### Result objects (field names are tested)

```js
const r = await products.insertOne({ name: "pen" });
// { acknowledged: true, insertedId: ObjectId("...") }

const rm = await products.insertMany([{ name: "a" }, { name: "b" }]);
// { acknowledged: true, insertedCount: 2, insertedIds: { '0': ObjectId(...), '1': ObjectId(...) } }
//   ↑ insertedIds is an OBJECT keyed by array index, not an array

const u = await products.updateOne({ name: "pen" }, { $set: { price: 3 } });
// { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null }

const d = await products.deleteMany({ price: { $lt: 1 } });
// { acknowledged: true, deletedCount: 4 }
```

Note the camelCase: `insertedId` (not `inserted_id`), `matchedCount`, `modifiedCount`, `deletedCount`, `upsertedId`.

### CRUD — full Node.js reference

```js
// ---------- CREATE ----------
await products.insertOne({ name: "pen", price: 2, tags: ["office"], createdAt: new Date() });
await products.insertMany([{ name: "a" }, { name: "b" }], { ordered: false });

// ---------- READ ----------
const one = await products.findOne({ name: "pen" });                    // doc or null
const byId = await products.findOne({ _id: new ObjectId("65f1c2...") }); // ⚠️ must wrap string in ObjectId

// chaining style
const list = await products
  .find({ price: { $gte: 2 } })
  .project({ name: 1, price: 1, _id: 0 })
  .sort({ price: -1, name: 1 })
  .skip(10)
  .limit(10)
  .toArray();

// options style (equivalent)
const list2 = await products
  .find({ price: { $gte: 2 } }, { projection: { name: 1, price: 1, _id: 0 }, sort: { price: -1 }, skip: 10, limit: 10 })
  .toArray();

// iterate without loading everything in memory
for await (const doc of products.find({ tags: "office" })) {
  console.log(doc.name);
}
// manual
const cursor = products.find({});
while (await cursor.hasNext()) { const doc = await cursor.next(); }

// count / distinct
await products.countDocuments({ price: { $gt: 1 } });
await products.estimatedDocumentCount();
await products.distinct("tags");                     // array of unique values

// ---------- UPDATE ----------
await products.updateOne({ name: "pen" }, { $set: { price: 3 }, $push: { tags: "sale" } });
await products.updateMany({ price: { $lt: 5 } }, { $inc: { price: 1 } });
await products.updateOne(
  { name: "ink" },
  { $set: { price: 9 }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }                                   // options = 3rd argument
);
await products.replaceOne({ name: "pen" }, { name: "pen", price: 4 });  // no operators

// atomic find + modify
const updated = await products.findOneAndUpdate(
  { name: "pen" },
  { $inc: { stock: -1 } },
  { returnDocument: "after", upsert: false, projection: { name: 1, stock: 1 } }
);
// returnDocument: "before" is the DEFAULT → returns the original doc
// v6+ returns the document (or null). Before v6 it returned { value, ok, lastErrorObject }.
// To get the old shape in v6+: { includeResultMetadata: true }

await products.findOneAndReplace({ name: "pen" }, { name: "pen", price: 5 }, { returnDocument: "after" });

// ---------- DELETE ----------
await products.deleteOne({ _id: new ObjectId(id) });
await products.deleteMany({ discontinued: true });
const removed = await products.findOneAndDelete({ name: "ink" });  // the deleted doc
await products.drop();                                             // whole collection

// ---------- BULK ----------
await products.bulkWrite([
  { insertOne: { document: { name: "x" } } },
  { updateOne: { filter: { name: "pen" }, update: { $set: { price: 6 } } } },
  { deleteOne: { filter: { name: "y" } } }
], { ordered: true });
```

### Aggregation in Node.js

```js
const pipeline = [
  { $match: { status: "paid", date: { $gte: new Date("2026-01-01") } } },
  { $group: { _id: "$cust", total: { $sum: "$amount" }, orders: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 5 }
];
const top = await db.collection("orders").aggregate(pipeline).toArray();

// with $lookup
const withProducts = await db.collection("orders").aggregate([
  { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $project: { _id: 0, qty: 1, "product.name": 1 } }
]).toArray();

// $out — still must iterate/consume the cursor so the pipeline executes!
await db.collection("orders").aggregate([
  { $group: { _id: "$cust", total: { $sum: "$amount" } } },
  { $out: "customer_totals" }
]).toArray();   // returns [] — results are written to customer_totals

// options (2nd argument)
db.collection("orders").aggregate(pipeline, { allowDiskUse: true });
```

> ⚠️ Because `aggregate()` returns a lazy cursor, a pipeline with `$out`/`$merge` doesn't run until you consume it (`toArray()`, `next()`, `for await`). Plain `aggregate([...$out])` with nothing after it writes nothing.

### mongosh vs Node.js — differences that become trick questions

| mongosh | Node.js driver |
|---|---|
| `db.products.find()` | `client.db("shop").collection("products").find()` |
| Results print automatically / type `it` | Must `await cursor.toArray()` or iterate |
| `ObjectId("...")` | `new ObjectId("...")` |
| `ISODate("2026-01-01")` | `new Date("2026-01-01")` |
| `NumberDecimal("9.99")` | `Decimal128.fromString("9.99")` |
| `NumberLong(5)` | `Long.fromNumber(5)` |
| `findOneAndUpdate(..., { returnNewDocument: true })` | `findOneAndUpdate(..., { returnDocument: "after" })` |
| `findAndModify({ query, update, new: true })` | ❌ not in driver → use `findOneAndUpdate` |
| `cursor.count()` | `countDocuments()` |
| `db.c.find({}, { name: 1 })` (2nd arg = projection) | `find({}, { projection: { name: 1 } })` (2nd arg = **options**) or `.project({ name: 1 })` |

That last row is a classic trap: in Node, `find(filter, { name: 1 })` does **not** project — the 2nd argument is an options object.

### Indexes and Atlas Search in Node.js

```js
const name = await products.createIndex({ category: 1, price: -1 });   // "category_1_price_-1"
await products.createIndex({ email: 1 }, { unique: true, name: "uniq_email" });
await products.createIndexes([{ key: { a: 1 } }, { key: { b: -1 } }]);
const idx = await products.listIndexes().toArray();                     // includes _id_
await products.indexes();                                               // same, as array
await products.dropIndex("category_1_price_-1");

// explain
const plan = await products.find({ category: "pens" }).explain("executionStats");
plan.queryPlanner.winningPlan;      // look for COLLSCAN vs IXSCAN
plan.executionStats.totalDocsExamined;

// Atlas Search index
await products.createSearchIndex({
  name: "default",
  definition: { mappings: { dynamic: true } }
});
await products.listSearchIndexes().toArray();

// Atlas Search query
const hits = await products.aggregate([
  { $search: { index: "default", text: { query: "blue pen", path: ["name", "description"], fuzzy: { maxEdits: 1 } } } },
  { $limit: 10 },
  { $project: { name: 1, score: { $meta: "searchScore" } } }
]).toArray();
```

### Error handling

```js
try {
  await users.insertOne({ _id: 1, email: "a@x.com" });
} catch (err) {
  if (err.code === 11000) console.log("Duplicate key");   // MongoServerError
}
// insertMany failures throw MongoBulkWriteError (err.result / err.writeErrors / err.insertedCount)
```

### Transactions in Node.js

```js
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }, { session });
    await accounts.updateOne({ _id: "B" }, { $inc: { balance: 100 } }, { session });
  });
} finally {
  await session.endSession();
}
```
`{ session }` goes in the **options** argument of every operation. `withTransaction` commits automatically and retries on transient errors; manual style is `startTransaction()` / `commitTransaction()` / `abortTransaction()`.

### Express-style reuse pattern (what "correct usage" looks like)

```js
// db.js
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);
module.exports = { db: client.db("shop") };

// routes.js
const { db } = require("./db");
app.get("/products/:id", async (req, res) => {
  const p = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
  p ? res.json(p) : res.sendStatus(404);
});
```
❌ Wrong pattern: `new MongoClient(uri)` + `connect()` + `close()` inside every route handler.

### Bonus: TypeScript generics (may appear in snippets)

```ts
interface Product { _id?: ObjectId; name: string; price: number }
const products = db.collection<Product>("products");
const p = await products.findOne({ name: "pen" });   // WithId<Product> | null
```

### Bonus: change streams

```js
const stream = products.watch([{ $match: { operationType: "insert" } }]);
stream.on("change", change => console.log(change.fullDocument));
```
Requires a replica set (Atlas is fine).

---

## 7. Top gotchas — read this the night before

1. `{ tags: "red" }` = contains; `{ tags: ["red","blank"] }` = exact array & order.
2. Embedded doc equality is exact, **field order included**. Use dot notation instead.
3. Range on array without `$elemMatch` can be satisfied by different elements.
4. Duplicate keys in a JS object → the **last one wins**. Use explicit `$and`.
5. `$ne`, `$nin`, `$not`, `$nor` match documents **missing** the field. `{ x: null }` matches missing too.
6. Projection: no mixing `1`/`0` except `_id: 0`.
7. Sort → skip → limit, regardless of chain order. Missing fields sort first ascending.
8. `replaceOne` wipes all fields not in the replacement (keeps `_id`). `updateOne` without operators errors.
9. `$set: { size: {...} }` replaces the subdocument; `$set: { "size.h": ... }` changes one field.
10. `upsert` is an **option**; inserted doc = filter equalities + update.
11. `findAndModify`/`findOneAndUpdate` return the **original** doc by default.
12. Concurrent upserts without a unique index can create duplicates.
13. `deleteMany({})` keeps the collection and indexes; `drop()` removes them.
14. `countDocuments(filter)` accurate; `estimatedDocumentCount()` no filter; `count()` deprecated.
15. `$search` must be the **first** stage; `createIndex({f:"text"})` ≠ Atlas Search index.
16. `$group` needs `_id`; uses `"$field"`; drops all other fields.
17. `$lookup` → always an array; unmatched → `[]`.
18. `$out` last stage, replaces the target collection, returns nothing.
19. Index count includes `_id`.
20. Sort `{a:1,b:-1}` needs index `{a:1,b:-1}` or `{a:-1,b:1}`.
21. ESR: Equality, Sort, Range.
22. `COLLSCAN` in explain = missing index. `totalDocsExamined ≫ nReturned` = inefficient.
23. One `MongoClient` per app; it holds the pool (`maxPoolSize` 100).
24. `mongodb+srv://` → no port, TLS on, DNS seed list. Percent-encode special chars in password.
25. Node: `find()` isn't awaited (returns cursor); `toArray()` is. Python: snake_case and `"$set"` in quotes.

### Node.js-specific gotchas
26. `find(filter, { name: 1 })` doesn't project in Node — use `{ projection: { name: 1 } }` or `.project()`.
27. `_id` lookups need `new ObjectId(idString)`; a plain string won't match an ObjectId.
28. `findOneAndUpdate` → `returnDocument: "after"` (not `returnNewDocument`, not `new: true`). v6+ returns the doc directly.
29. `insertMany` result: `insertedCount` + `insertedIds` (an object keyed by index).
30. `upsert`, `session`, `ordered`, `returnDocument`, `projection`, `sort` all go in the **options** object.
31. `aggregate()` with `$out` must be consumed (`toArray()`) to run.
32. No callbacks in modern drivers — `async/await`.
33. `client.db()` / `collection()` are sync; nothing is created until the first write.

---

## 8. Practice questions

<details><summary><b>Q1.</b> Which are valid BSON types? (choose 3) — A) Decimal128 B) Set C) ObjectId D) Tuple E) Date</summary>

**A, C, E.** Set and Tuple aren't BSON types.
</details>

<details><summary><b>Q2.</b> Collection has <code>{_id:1, tags:["a","b"]}</code>, <code>{_id:2, tags:["b","a"]}</code>, <code>{_id:3, tags:["a","b","c"]}</code>. What does <code>find({tags:["a","b"]})</code> return?</summary>

Only **_id: 1** (exact array, exact order). `{tags:"a"}` would return all three; `{tags:{$all:["a","b"]}}` returns all three.
</details>

<details><summary><b>Q3.</b> Document: <code>{_id:1, name:"x", qty:5, tags:["t"]}</code>. After <code>db.c.replaceOne({_id:1}, {name:"y"})</code>, what is the document?</summary>

`{ _id: 1, name: "y" }` — qty and tags are gone.
</details>

<details><summary><b>Q4.</b> Which update creates <code>{ item: "pen", qty: 0, created: ISODate(...) }</code> if "pen" doesn't exist but only increments qty if it does?</summary>

```js
db.c.updateOne(
  { item: "pen" },
  { $inc: { qty: 0 }, $setOnInsert: { created: new Date() } },
  { upsert: true }
)
```
(In general: filter equality fields + update, `upsert: true` as the third argument, `$setOnInsert` for insert-only fields.)
</details>

<details><summary><b>Q5.</b> <code>{_id:"c", seq:10}</code>. Two clients run simultaneously <code>findOneAndUpdate({_id:"c"}, {$inc:{seq:1}})</code> with default options. Final seq and returned values?</summary>

Final `seq: 12`. One client gets `{seq: 10}`, the other `{seq: 11}` — default returns the **pre-update** document; the operations are atomic and serialized.
</details>

<details><summary><b>Q6.</b> Doc <code>{scores:[60, 95]}</code>. Does <code>find({scores:{$gt:70, $lt:80}})</code> match? And with <code>$elemMatch</code>?</summary>

Without `$elemMatch`: **yes** (95 > 70, 60 < 80). With `$elemMatch`: **no** (no single element between 70 and 80).
</details>

<details><summary><b>Q7.</b> Which projection is invalid? A) <code>{name:1,_id:0}</code> B) <code>{name:0,age:0}</code> C) <code>{name:1,age:0}</code> D) <code>{"address.city":1}</code></summary>

**C** — mixes inclusion and exclusion on non-`_id` fields.
</details>

<details><summary><b>Q8.</b> Docs qty: 10, 50, 30, 20. Result of <code>find().limit(2).sort({qty:-1})</code>?</summary>

50, 30. Sort is applied before limit, no matter the chain order.
</details>

<details><summary><b>Q9.</b> Which return the number of docs with <code>status:"A"</code>? (choose 2) A) <code>countDocuments({status:"A"})</code> B) <code>estimatedDocumentCount({status:"A"})</code> C) <code>aggregate([{$match:{status:"A"}},{$count:"n"}])</code> D) <code>find({status:"A"}).length</code></summary>

**A, C.** `estimatedDocumentCount` ignores filters.
</details>

<details><summary><b>Q10.</b> <code>find({x:{$gt:1}, x:{$lt:10}})</code> — what is actually evaluated?</summary>

Only `x < 10` (duplicate key; the last wins). Correct: `{x:{$gt:1,$lt:10}}`.
</details>

<details><summary><b>Q11.</b> Collection: <code>{cust:"A",amt:5}</code>, <code>{cust:"A",amt:7}</code>, <code>{cust:"B",amt:3}</code>. Output of <code>[{$match:{amt:{$gt:4}}},{$group:{_id:"$cust", t:{$sum:"$amt"}}}]</code>?</summary>

`{ _id: "A", t: 12 }` only. B's doc is filtered out by `$match`.
</details>

<details><summary><b>Q12.</b> orders <code>{_id:1, pid:7}</code>, <code>{_id:2, pid:9}</code>; products <code>{_id:7, name:"pen"}</code>. Output of <code>$lookup {from:"products", localField:"pid", foreignField:"_id", as:"p"}</code>?</summary>

`{ _id: 1, pid: 7, p: [ { _id: 7, name: "pen" } ] }` and `{ _id: 2, pid: 9, p: [] }`.
</details>

<details><summary><b>Q13.</b> <code>totals</code> has 100 docs. You run a pipeline ending in <code>{$out:"totals"}</code> producing 3 docs. How many docs are in <code>totals</code>?</summary>

**3.** `$out` replaces the collection.
</details>

<details><summary><b>Q14.</b> Query: <code>find({status:"A", age:{$gte:21}}).sort({name:1})</code>. Best index?</summary>

`{ status: 1, name: 1, age: 1 }` (ESR).
</details>

<details><summary><b>Q15.</b> You created indexes <code>{a:1}</code> and <code>{a:1,b:-1}</code>. How many indexes? Which is redundant?</summary>

**3** (including `_id`). `{a:1}` is redundant — `{a:1,b:-1}` covers queries on `a` by prefix.
</details>

<details><summary><b>Q16.</b> explain shows <code>stage: "COLLSCAN"</code>, <code>nReturned: 3</code>, <code>totalDocsExamined: 1000000</code>. What's the issue?</summary>

No index supports the query; it scans the whole collection. Create an index on the filter field(s).
</details>

<details><summary><b>Q17.</b> Which index supports <code>find().sort({a:-1, b:1})</code>? (choose 2) A) <code>{a:1,b:-1}</code> B) <code>{a:-1,b:1}</code> C) <code>{a:1,b:1}</code> D) <code>{b:1,a:-1}</code></summary>

**A, B** (same or exact inverse).
</details>

<details><summary><b>Q18.</b> Blog: posts, comments (thousands per post), and categories (2–3 per post, short strings). Model?</summary>

Embed **categories** in the post; **reference** comments (separate collection with `postId`); reference the author `userId`.
</details>

<details><summary><b>Q19.</b> Correct <code>$search</code> usage?</summary>

```js
db.movies.aggregate([{ $search: { index: "default", text: { query: "baseball", path: "plot" } } }])
```
Must be the first stage. `db.movies.find({$search: ...})` and placing it after `$match` are wrong.
</details>

<details><summary><b>Q20.</b> Password is <code>p@ss:1</code>. How must it appear in the URI?</summary>

`p%40ss%3A1` (percent-encoded).
</details>

<details><summary><b>Q21.</b> Best practice for MongoClient in a web API?</summary>

Create a single `MongoClient` at startup and reuse it across requests (it's thread-safe and manages the connection pool). Don't create/close one per request.
</details>

<details><summary><b>Q22.</b> (Node) What's wrong: <code>const docs = await coll.find({}).limit(5);</code> then <code>docs.forEach(...)</code>?</summary>

`find()` returns a **cursor**, not an array. Use `await coll.find({}).limit(5).toArray()`.
</details>

<details><summary><b>Q23.</b> (Python) Correct upsert?  A) <code>update_one({"a":1},{"$set":{"b":2}},{"upsert":True})</code>  B) <code>update_one({"a":1},{"$set":{"b":2}}, upsert=True)</code>  C) <code>updateOne({"a":1},{"$set":{"b":2}}, upsert=True)</code></summary>

**B.** Python uses `snake_case` and keyword arguments.
</details>

<details><summary><b>Q24.</b> Which docs match <code>find({x:null})</code>? <code>{_id:1,x:null}</code>, <code>{_id:2}</code>, <code>{_id:3,x:0}</code></summary>

**1 and 2.** `null` matches null and missing fields; `0` is not null.
</details>

<details><summary><b>Q25.</b> Docs: <code>{_id:1, g:[{s:"A", p:90},{s:"B", p:60}]}</code>. Which query matches? A) <code>{"g.s":"B","g.p":{$gt:80}}</code> B) <code>{g:{$elemMatch:{s:"B",p:{$gt:80}}}}</code></summary>

**A** matches (different elements satisfy each condition); **B** doesn't.
</details>

---

## 8B. Node.js driver practice questions

<details><summary><b>N1.</b> What does <code>const docs = await coll.find({ a: 1 })</code> store in <code>docs</code>?</summary>

A `FindCursor`, not an array (awaiting a non-promise just returns it). Use `await coll.find({ a: 1 }).toArray()`.
</details>

<details><summary><b>N2.</b> Which returns only <code>name</code> (no <code>_id</code>)? (choose 2) A) <code>coll.find({}, { name: 1, _id: 0 })</code> B) <code>coll.find({}, { projection: { name: 1, _id: 0 } })</code> C) <code>coll.find({}).project({ name: 1, _id: 0 })</code> D) <code>coll.find({}).select("name")</code></summary>

**B, C.** In Node, A's second argument is treated as options; D is Mongoose, not the driver.
</details>

<details><summary><b>N3.</b> Correct way to update a document whose id arrives as a string <code>req.params.id</code>?</summary>

```js
await coll.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: "done" } });
```
</details>

<details><summary><b>N4.</b> Which code returns the document AFTER decrementing stock?</summary>

```js
const doc = await coll.findOneAndUpdate({ sku: "p1" }, { $inc: { stock: -1 } }, { returnDocument: "after" });
```
Not `{ new: true }` (findAndModify in mongosh) or `{ returnNewDocument: true }` (mongosh).
</details>

<details><summary><b>N5.</b> Correct insertMany? A) <code>await coll.insertMany({ a: 1 }, { b: 2 })</code> B) <code>await coll.insertMany([{ a: 1 }, { b: 2 }])</code> C) <code>await coll.insertMany([{ a: 1 }, { b: 2 }]).toArray()</code> D) <code>coll.insert([{ a: 1 }])</code></summary>

**B.** A isn't an array; C — insertMany returns a promise, not a cursor; D — `insert` is removed in modern drivers.
</details>

<details><summary><b>N6.</b> After <code>const r = await coll.insertMany([{x:1},{x:2}])</code>, how do you get the count and the id of the first doc?</summary>

`r.insertedCount` → 2; `r.insertedIds[0]` → ObjectId.
</details>

<details><summary><b>N7.</b> Correct upsert in Node? A) <code>updateOne({ sku: "x" }, { $set: { qty: 5 }, upsert: true })</code> B) <code>updateOne({ sku: "x" }, { $set: { qty: 5 } }, { upsert: true })</code> C) <code>upsertOne({ sku: "x" }, { qty: 5 })</code></summary>

**B.** Options go in the 3rd argument; `upsertOne` doesn't exist.
</details>

<details><summary><b>N8.</b> An Express app creates <code>new MongoClient(uri)</code>, connects and closes it in every route. What's wrong?</summary>

It discards the connection pool each time — a new TCP/TLS handshake and auth per request, high latency and connection churn. Create one client at startup and reuse it.
</details>

<details><summary><b>N9.</b> Which runs an aggregation and gets results? A) <code>await coll.aggregate([{ $match: { a: 1 } }]).toArray()</code> B) <code>await coll.aggregate({ $match: { a: 1 } })</code> C) <code>await coll.find([{ $match: { a: 1 } }]).toArray()</code></summary>

**A.** The pipeline is an array, and `aggregate` returns a cursor.
</details>

<details><summary><b>N10.</b> How do you set the maximum connection pool size to 20? (choose 2)</summary>

`new MongoClient(uri, { maxPoolSize: 20 })` or adding `?maxPoolSize=20` to the URI.
</details>

<details><summary><b>N11.</b> Which counts documents with <code>status: "A"</code> in Node? A) <code>await coll.countDocuments({ status: "A" })</code> B) <code>await coll.find({ status: "A" }).length</code> C) <code>await coll.estimatedDocumentCount({ status: "A" })</code></summary>

**A.** B gives `undefined` (cursor has no length); C ignores the filter.
</details>

<details><summary><b>N12.</b> How do you delete all documents where <code>expired</code> is true and know how many were removed?</summary>

```js
const { deletedCount } = await coll.deleteMany({ expired: true });
```
</details>

<details><summary><b>N13.</b> Which is the MQL equivalent of <code>aggregate([{ $match: { a: 1 } }, { $sort: { b: -1 } }, { $limit: 3 }])</code>?</summary>

```js
coll.find({ a: 1 }).sort({ b: -1 }).limit(3)
```
</details>

<details><summary><b>N14.</b> Where does the <code>session</code> go when updating inside a transaction?</summary>

In the options: `await coll.updateOne(filter, update, { session })`.
</details>

---

## 9. Suggested study plan (2–3 weeks, ~40–60 h)

| Days | Focus |
|---|---|
| 1–2 | Atlas free cluster, load sample dataset, practice in Data Explorer + mongosh. Section 1. |
| 3–7 | **CRUD** in mongosh: every example in section 2 on `sample_mflix` / `sample_training`. Predict the output before running. |
| 8–9 | Aggregation (`$match`, `$group`, `$lookup`, `$unwind`, `$out`) + Atlas Search (create a dynamic index, run `text`, `compound`, `autocomplete`). |
| 10–11 | Indexes: create, `explain("executionStats")`, compare COLLSCAN vs IXSCAN, ESR, sort direction. |
| 12–13 | **Node.js driver**: `npm init -y && npm install mongodb`, then write one script per section of 6B against `sample_mflix` (insert/update/delete/find/aggregate/count, upsert, findOneAndUpdate, indexes, `$search`). Log every result object to learn its field names. |
| 14 | Data modeling + tools. |
| 15+ | Official practice questions + mock exams; review every wrong answer; re-read "Top gotchas". |

### Official resources
- MongoDB University — Associate Developer learning path for your language (free; completion gives a 50% exam discount).
- Associate Developer Practice Questions + Certification Deep Dive video (linked in the exam guide).
- MongoDB Docs: CRUD, Aggregation, Indexes, Atlas Search, and your driver's docs.

### Exam-day tips
- ~85 seconds per question; **flag and move on** when stuck.
- For multiple response, the prompt tells you how many to pick — pick exactly that many.
- "Which documents match" questions: evaluate **each document** against **each condition** on scratch paper/mentally.
- Watch for traps: missing `$`, missing quotes on dotted fields, wrong case (`insertone`), `insertMany` without an array, options placed in the wrong argument, mixed projections.
- Run the ProctorU system check days before; clean desk, alone in the room, valid ID matching your registration name.
