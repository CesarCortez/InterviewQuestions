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

> 💡 **Why is `updateOne(filter, { qty: 30 })` wrong?** `updateOne` needs operators (`$set`, `$inc`…). Without them MongoDB can't tell if you want to change `qty` (`$set`) or replace the whole document (`replaceOne`), so it throws *"Update document requires atomic operators"*. The old `update()` silently replaced the whole document and people lost data, so the modern API splits the two cases:
> - change fields → `updateOne(filter, { $set: { qty: 30 } })`
> - replace the doc → `replaceOne(filter, { qty: 30 })` (all other fields removed, `_id` kept)

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

#### 💡 Key ideas explained simply

**Atomic** = all at once or not at all. Every write to **one document** is atomic: other clients see the doc before or after, never half-updated, and nothing sneaks in between.
```js
// ❌ NOT atomic (read in app, then write): two buyers both read qty 1, both write 0 → lost update
const p = await coll.findOne({ _id: 1 });
await coll.updateOne({ _id: 1 }, { $set: { qty: p.qty - 1 } });

// ✅ atomic: server checks and changes in one step; 2nd buyer gets matchedCount 0
await coll.updateOne({ _id: 1, qty: { $gt: 0 } }, { $inc: { qty: -1 } });
```
`updateMany` is atomic **per document**, not as a whole. All-or-nothing across documents needs a **transaction**.

**`$inc`** adds a number (negative to subtract).
```js
// { qty: 10 }  →  { $inc: { qty: 5 } }   →  { qty: 15 }
// { }          →  { $inc: { qty: 5 } }   →  { qty: 5 }    (missing field is created)
// { qty: "10" }→  { $inc: { qty: 1 } }   →  ERROR (not a number)
```

**`$min` / `$max`** change the field **only if** the new value is smaller / bigger.
```js
// { low: 50, high: 80 }
{ $min: { low: 30 } }   // 30 < 50 → low = 30
{ $min: { low: 70 } }   // 70 > 30 → no change (matchedCount 1, modifiedCount 0)
{ $max: { high: 95 } }  // 95 > 80 → high = 95
```
Missing field → created. Works with dates (`$max: { lastSeen: new Date() }`).
⚠️ Inside `$group`, `$min`/`$max` are different: **accumulators** that return the smallest/largest value of the group.

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

Step by step with the sample data:

| item | qty | `qty < 50`? | after `$set` |
|---|---|---|---|
| journal | 25 | ✅ | gets `reorder: true` |
| notebook | 50 | ❌ (50 is not < 50; `$lte` would match) | unchanged |
| paper | 100 | ❌ | unchanged |
| planner | 75 | ❌ | unchanged |
| postcard | 45 | ✅ | gets `reorder: true` |

- `matchedCount` = docs that passed the filter; `modifiedCount` = docs that actually changed. Run it **again** → `matchedCount: 2, modifiedCount: 0` (already `true`).
- `{}` = empty filter = **all** documents → 2nd command adds 1 to qty in all 5.
- Same filter with `updateOne` → only **journal** (first match) changes.

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

---

## 10. Mock exam — 53 questions (Node.js)

> The real exam questions are confidential, so these are **not** the actual questions. They are written in the **same format** as MongoDB's official practice questions (scenario + 4 options, "Choose 2" for multiple response) and cover **every objective** of the study guide, with the same 53-question count. Time yourself: **75 minutes**. Click **Answer** to reveal.

### Section 1 — Document model

**1.** Which of the following are valid BSON types? *(Choose 2)*
- A. Decimal128
- B. Character
- C. Set
- D. ObjectId

<details><summary>Answer</summary>

**A, D.** Character and Set don't exist in BSON. *(1.1)*
</details>

**2.** A `users` collection has no schema validation. You try to insert these three documents. Which statement is correct?
```js
{ _id: 1, name: "Ana", age: 30 }
{ _id: 2, name: "Luis", phones: ["555-1234"] }
{ _id: 1, fullName: "Eva Ruiz" }
```
- A. All three can co-exist because MongoDB has a flexible schema.
- B. Only the first two can co-exist; the third has a duplicate `_id`.
- C. The second fails because arrays need a schema.
- D. Documents in a collection must share the same fields.

<details><summary>Answer</summary>

**B.** Different shapes are fine; a duplicate `_id` is not. *(1.2)*
</details>

### Section 2 — CRUD

**3.** You need to store a book with title "Dune", authors "Frank Herbert", and year 1965. Which command is correctly formed?
- A. `db.books.insertOne({ title: "Dune", authors: ["Frank Herbert"], year: 1965 })`
- B. `db.books.insertOne([{ title: "Dune", authors: ["Frank Herbert"], year: 1965 }])`
- C. `db.books.insertMany({ title: "Dune", authors: ["Frank Herbert"], year: 1965 })`
- D. `db.books.insertOne({ title: Dune, authors: [Frank Herbert], year: 1965 })`

<details><summary>Answer</summary>

**A.** B passes an array to insertOne; C passes a single doc to insertMany; D has unquoted strings. *(2.1)*
</details>

**4.** Which commands insert **both** documents `{ sku: "a" }` and `{ sku: "b" }`? *(Choose 2)*
- A. `db.items.insertMany([{ sku: "a" }, { sku: "b" }])`
- B. `db.items.insertMany({ sku: "a" }, { sku: "b" })`
- C. `db.items.insertOne({ sku: "a" }); db.items.insertOne({ sku: "b" })`
- D. `db.items.insertOne([{ sku: "a" }, { sku: "b" }])`

<details><summary>Answer</summary>

**A, C.** insertMany needs an array; two insertOne calls also work. *(2.1)*
</details>

**5.** The `products` collection contains `{ _id: 7, name: "Lamp", price: 20, stock: 5 }`. What is the document after this command?
```js
db.products.replaceOne({ _id: 7 }, { name: "Lamp", price: 25 })
```
- A. `{ _id: 7, name: "Lamp", price: 25, stock: 5 }`
- B. `{ _id: 7, name: "Lamp", price: 25 }`
- C. `{ _id: ObjectId("..."), name: "Lamp", price: 25 }`
- D. The command fails because `stock` is missing.

<details><summary>Answer</summary>

**B.** Replacement removes every field not provided; `_id` is kept. *(2.2)*
</details>

**6.** Same original document. What happens with `db.products.updateOne({ _id: 7 }, { price: 25 })`?
- A. The document is replaced by `{ _id: 7, price: 25 }`.
- B. Only `price` changes to 25.
- C. An error is returned: the update document requires atomic operators.
- D. A new document is inserted.

<details><summary>Answer</summary>

**C.** `updateOne` needs `$set` (or another operator). Use `replaceOne` to replace. *(2.2)*
</details>

**7.** A document is `{ _id: 1, name: "Ana", address: { city: "GDL", zip: "44100" } }`. What is it after this update?
```js
db.users.updateOne({ _id: 1 }, { $set: { "address.city": "CDMX", age: 31 } })
```
- A. `{ _id: 1, name: "Ana", address: { city: "CDMX" }, age: 31 }`
- B. `{ _id: 1, name: "Ana", address: { city: "CDMX", zip: "44100" }, age: 31 }`
- C. `{ _id: 1, name: "Ana", address: { city: "CDMX", zip: "44100" } }` — `age` is ignored because it didn't exist
- D. An error, because `age` doesn't exist.

<details><summary>Answer</summary>

**B.** Dot notation changes only `city`; `$set` creates missing fields. *(2.3)*
</details>

**8.** Same original document. What is it after `{ $set: { address: { city: "CDMX" } } }`?
- A. `{ _id: 1, name: "Ana", address: { city: "CDMX", zip: "44100" } }`
- B. `{ _id: 1, name: "Ana", address: { city: "CDMX" } }`
- C. `{ _id: 1, address: { city: "CDMX" } }`
- D. An error.

<details><summary>Answer</summary>

**B.** Setting the whole `address` object replaces it, so `zip` is lost. *(2.3)*
</details>

**9.** Set the stock of the product with `sku: "A1"` to 10. If it doesn't exist, create it. Which command should you use?
- A. `db.products.updateOne({ sku: "A1" }, { $set: { stock: 10 } }, { upsert: true })`
- B. `db.products.updateOne({ sku: "A1" }, { $set: { stock: 10 }, upsert: true })`
- C. `db.products.updateOne({ sku: "A1" }, { stock: 10 }, { upsert: true })`
- D. `db.products.insertOne({ sku: "A1", stock: 10 }, { upsert: true })`

<details><summary>Answer</summary>

**A.** `upsert` is an option (3rd argument); C has no operator; insertOne has no upsert. *(2.4)*
</details>

**10.** The `users` collection is empty. What does it contain after this command?
```js
db.users.updateOne({ name: "Ana", age: { $gt: 18 } }, { $set: { city: "GDL" } }, { upsert: true })
```
- A. Nothing; upsert needs an exact match.
- B. `{ _id: ObjectId(...), name: "Ana", age: { $gt: 18 }, city: "GDL" }`
- C. `{ _id: ObjectId(...), name: "Ana", city: "GDL" }`
- D. `{ _id: ObjectId(...), city: "GDL" }`

<details><summary>Answer</summary>

**C.** Only **equality** fields from the filter are copied; range conditions are not. *(2.4)*
</details>

**11.** Give a 10% discount to **all** products in the category "toys". Which command should you use?
- A. `db.products.updateMany({ category: "toys" }, { $mul: { price: 0.9 } })`
- B. `db.products.updateOne({ category: "toys" }, { $mul: { price: 0.9 } })`
- C. `db.products.updateMany({ category: "toys" }, { price: price * 0.9 })`
- D. `db.products.updateMany({}, { $mul: { price: 0.9 } })`

<details><summary>Answer</summary>

**A.** B changes only the first match; C has no operator; D discounts everything. *(2.5)*
</details>

**12.** `inventory` has documents with qty 25, 50, 100, 75 and 45. What is `matchedCount` for this command?
```js
db.inventory.updateMany({ qty: { $lte: 50 } }, { $set: { reorder: true } })
```
- A. 2
- B. 3
- C. 4
- D. 5

<details><summary>Answer</summary>

**B.** 25, 50 and 45 (`$lte` includes 50). *(2.5)*
</details>

**13.** `counters` has `{ _id: "invoice", seq: 100 }`. Two application servers run this at the same moment:
```js
db.counters.findAndModify({ query: { _id: "invoice" }, update: { $inc: { seq: 1 } }, new: true })
```
Which statement is true?
- A. Both receive `seq: 101`, and the final value is 101.
- B. One receives 101 and the other 102; the final value is 102.
- C. Both receive 102.
- D. Both operations fail with a write conflict.

<details><summary>Answer</summary>

**B.** Single-document updates are atomic and serialized; `new: true` returns the updated doc. *(2.6)*
</details>

**14.** A document is `{ _id: 1, status: "pending" }`. What does this return (no options)?
```js
db.orders.findOneAndUpdate({ _id: 1 }, { $set: { status: "shipped" } })
```
- A. `{ _id: 1, status: "pending" }`, and the database now has "shipped"
- B. `{ _id: 1, status: "shipped" }`
- C. `{ matchedCount: 1, modifiedCount: 1 }`
- D. `null`

<details><summary>Answer</summary>

**A.** The default returns the document **before** the update. *(2.6)*
</details>

**15.** `email` has a unique index. Which commands delete **only** the user with email "ana@x.com"? *(Choose 2)*
- A. `db.users.deleteOne({ email: "ana@x.com" })`
- B. `db.users.deleteMany({ email: "ana@x.com" })`
- C. `db.users.deleteOne({})`
- D. `db.users.drop({ email: "ana@x.com" })`

<details><summary>Answer</summary>

**A, B.** With a unique email, only one doc can match. C deletes an arbitrary doc; D drops the collection. *(2.7)*
</details>

**16.** Retrieve the single movie titled "Titanic". Which command should you use?
- A. `db.movies.findOne({ title: "Titanic" })`
- B. `db.movies.findOne("Titanic")`
- C. `db.movies.find({ $title: "Titanic" })`
- D. `db.movies.findOne({ title: { "Titanic" } })`

<details><summary>Answer</summary>

**A.** *(2.8)*
</details>

**17.** Given:
```js
{ _id: 1, colors: ["red", "blue"] }
{ _id: 2, colors: ["blue", "red"] }
{ _id: 3, colors: ["red"] }
{ _id: 4, colors: "red" }
```
Which documents does `db.c.find({ colors: "red" })` return?
- A. 3 and 4
- B. 4 only
- C. 1, 2 and 3
- D. 1, 2, 3 and 4

<details><summary>Answer</summary>

**D.** A scalar value matches a field equal to it **or** an array containing it. *(2.9)*
</details>

**18.** Same documents. Which documents does `db.c.find({ colors: ["blue", "red"] })` return?
- A. 1 and 2
- B. 2 only
- C. 1, 2 and 3
- D. None

<details><summary>Answer</summary>

**B.** An array value requires an exact match, **order included**. Use `$all` for "contains both". *(2.9)*
</details>

**19.** Given:
```js
{ _id: 1, age: 17 }
{ _id: 2, age: "20" }
{ _id: 3, age: 25 }
{ _id: 4 }
```
Which documents does `db.p.find({ age: { $gte: 18 } })` return?
- A. 3 only
- B. 2 and 3
- C. 2, 3 and 4
- D. 1, 2 and 3

<details><summary>Answer</summary>

**A.** "20" is a string, so a numeric comparison skips it; doc 4 has no `age`. *(2.10)*
</details>

**20.** Same documents. Which documents does `db.p.find({ age: { $ne: 25 } })` return?
- A. 1 only
- B. 1 and 2
- C. 1, 2 and 4
- D. 1, 2, 3 and 4

<details><summary>Answer</summary>

**C.** `$ne` also matches documents **missing** the field. *(2.10)*
</details>

**21.** Given:
```js
{ _id: 1, size: "S" }
{ _id: 2, size: "M" }
{ _id: 3, size: ["L", "XL"] }
{ _id: 4, size: "XL" }
```
Which documents does `db.shirts.find({ size: { $in: ["M", "XL"] } })` return?
- A. 2 and 4
- B. 2, 3 and 4
- C. 3 only
- D. 1, 2, 3 and 4

<details><summary>Answer</summary>

**B.** `$in` matches if the value — or any array element — is in the list. *(2.11)*
</details>

**22.** Given:
```js
{ _id: 1, results: [ { product: "abc", score: 10 }, { product: "xyz", score: 5 } ] }
{ _id: 2, results: [ { product: "abc", score: 8 },  { product: "xyz", score: 7 } ] }
{ _id: 3, results: [ { product: "abc", score: 7 },  { product: "xyz", score: 8 } ] }
```
Which documents does this query return?
```js
db.survey.find({ results: { $elemMatch: { product: "xyz", score: { $gte: 8 } } } })
```
- A. 1 only
- B. 3 only
- C. 1 and 3
- D. 1, 2 and 3

<details><summary>Answer</summary>

**B.** One single element must be "xyz" **and** ≥ 8. *(2.12)*
</details>

**23.** Same documents. Which documents does `db.survey.find({ "results.product": "xyz", "results.score": { $gte: 8 } })` return?
- A. 3 only
- B. 1 and 3
- C. 2 and 3
- D. 1, 2 and 3

<details><summary>Answer</summary>

**D.** With dot notation, the conditions can be met by **different** elements. Every doc has "xyz" and some score ≥ 8. *(2.12)*
</details>

**24.** Given:
```js
{ _id: 1, category: "office", price: 5,  qty: 20 }
{ _id: 2, category: "office", price: 15, qty: 200 }
{ _id: 3, category: "toys",   price: 3,  qty: 500 }
{ _id: 4, category: "office", price: 12, qty: 50 }
```
Which documents does this query return?
```js
db.products.find({ category: "office", $or: [ { price: { $lt: 10 } }, { qty: { $gt: 100 } } ] })
```
- A. 1 only
- B. 1 and 2
- C. 1, 2 and 3
- D. 1, 2 and 4

<details><summary>Answer</summary>

**B.** It must be office **and** (price < 10 **or** qty > 100). *(2.13)*
</details>

**25.** Which query returns documents where (`a` = 1 OR `b` = 1) AND (`c` = 1 OR `d` = 1)?
- A. `find({ $or: [{ a: 1 }, { b: 1 }], $or: [{ c: 1 }, { d: 1 }] })`
- B. `find({ $and: [ { $or: [{ a: 1 }, { b: 1 }] }, { $or: [{ c: 1 }, { d: 1 }] } ] })`
- C. `find({ $or: [{ a: 1 }, { b: 1 }, { c: 1 }, { d: 1 }] })`
- D. `find({ a: 1, b: 1, c: 1, d: 1 })`

<details><summary>Answer</summary>

**B.** In A the duplicate `$or` key overwrites the first one. *(2.13)*
</details>

**26.** Given scores A: 80, B: 95, C: 70, D: 88. What does this query return?
```js
db.players.find().sort({ score: -1 }).skip(1).limit(2)
```
- A. B, D
- B. D, A
- C. A, C
- D. B, D, A

<details><summary>Answer</summary>

**B.** Sorted: B 95, D 88, A 80, C 70 → skip 1 → take 2. *(2.14)*
</details>

**27.** Which projection is **incorrect**?
- A. `{ title: 1, year: 1 }`
- B. `{ title: 1, _id: 0 }`
- C. `{ title: 0, plot: 0 }`
- D. `{ title: 1, plot: 0 }`

<details><summary>Answer</summary>

**D.** You can't mix inclusion and exclusion except for `_id`. *(2.15)*
</details>

**28.** Which cursor method returns all remaining documents as an array?
- A. `next()`
- B. `hasNext()`
- C. `toArray()`
- D. `batchSize()`

<details><summary>Answer</summary>

**C.** In mongosh you can also type `it` to see the next 20. *(2.16)*
</details>

**29.** Which expressions return the number of documents with `status: "A"`? *(Choose 2)*
- A. `db.orders.countDocuments({ status: "A" })`
- B. `db.orders.estimatedDocumentCount({ status: "A" })`
- C. `db.orders.aggregate([{ $match: { status: "A" } }, { $count: "total" }])`
- D. `db.orders.find({ status: "A" }).length`

<details><summary>Answer</summary>

**A, C.** `estimatedDocumentCount` ignores filters; a cursor has no `length`. *(2.17)*
</details>

**30.** You want an Atlas Search index that indexes **all** fields of `movies`. Which definition should you use?
- A. `{ "mappings": { "dynamic": true } }`
- B. `{ "mappings": { "dynamic": false } }`
- C. `db.movies.createIndex({ "$**": "text" })`
- D. `db.movies.createIndex({ title: "search" })`

<details><summary>Answer</summary>

**A.** B with no `fields` indexes nothing; C creates a legacy text index, not Atlas Search; D is invalid. *(2.18)*
</details>

**31.** Find movies whose `plot` mentions "baseball" using the Atlas Search index "default". Which query should you use?
- A. `db.movies.find({ $search: { text: { query: "baseball", path: "plot" } } })`
- B. `db.movies.aggregate([{ $search: { index: "default", text: { query: "baseball", path: "plot" } } }])`
- C. `db.movies.aggregate([{ $match: { year: 2000 } }, { $search: { index: "default", text: { query: "baseball", path: "plot" } } }])`
- D. `db.movies.aggregate([{ $match: { $text: { $search: "baseball" } } }])`

<details><summary>Answer</summary>

**B.** `$search` is an aggregation stage and must be **first**. D uses the legacy text index. *(2.19)*
</details>

**32.** Given:
```js
{ item: "pen", qty: 2, store: "N" }
{ item: "pen", qty: 3, store: "S" }
{ item: "ink", qty: 5, store: "N" }
{ item: "pen", qty: 1, store: "N" }
```
What does this pipeline output?
```js
db.sales.aggregate([
  { $match: { store: "N" } },
  { $group: { _id: "$item", total: { $sum: "$qty" } } }
])
```
- A. `{ _id: "pen", total: 6 }`, `{ _id: "ink", total: 5 }`
- B. `{ _id: "pen", total: 3 }`, `{ _id: "ink", total: 5 }`
- C. `{ _id: "N", total: 8 }`
- D. `{ item: "pen", total: 3 }`, `{ item: "ink", total: 5 }`

<details><summary>Answer</summary>

**B.** The S store is filtered out (pen = 2 + 1). The output key is `_id`, not `item`. *(2.20)*
</details>

**33.** Given authors `{ _id: 1, name: "Rulfo" }`, `{ _id: 2, name: "Paz" }` and books `{ title: "Pedro Páramo", authorId: 1 }`, `{ title: "El llano en llamas", authorId: 1 }`. What does this pipeline output for Paz?
```js
db.authors.aggregate([
  { $lookup: { from: "books", localField: "_id", foreignField: "authorId", as: "books" } }
])
```
- A. Paz is not returned.
- B. `{ _id: 2, name: "Paz", books: null }`
- C. `{ _id: 2, name: "Paz", books: [] }`
- D. `{ _id: 2, name: "Paz" }`

<details><summary>Answer</summary>

**C.** `$lookup` is a left outer join and `as` is always an array. Rulfo gets an array with 2 books. *(2.21)*
</details>

**34.** `report` already has 50 documents and an index on `{ total: 1 }`. A pipeline ending in `{ $out: "report" }` produces 4 documents. Which statements are true? *(Choose 2)*
- A. `report` now has 4 documents.
- B. `report` now has 54 documents.
- C. The `aggregate()` call returns the 4 documents to the client.
- D. The `{ total: 1 }` index still exists.

<details><summary>Answer</summary>

**A, D.** `$out` replaces the contents, keeps existing indexes, and returns no documents. *(2.22)*
</details>

### Section 3 — Indexes

**35.** This query does a COLLSCAN. Which index best improves it?
```js
db.orders.find({ customer: "C1", status: "open" }).sort({ date: -1 })
```
- A. `{ date: -1 }`
- B. `{ customer: 1, status: 1, date: -1 }`
- C. `{ date: -1, customer: 1, status: 1 }`
- D. `{ status: 1 }`

<details><summary>Answer</summary>

**B.** The equality fields go first, then the sort field. *(3.1)*
</details>

**36.** Which index best supports this query?
```js
db.products.find({ status: "A", price: { $gt: 100 } }).sort({ name: 1 })
```
- A. `{ status: 1, price: 1, name: 1 }`
- B. `{ status: 1, name: 1, price: 1 }`
- C. `{ price: 1, name: 1, status: 1 }`
- D. `{ name: 1 }`

<details><summary>Answer</summary>

**B.** ESR: Equality (status) → Sort (name) → Range (price). *(3.1)*
</details>

**37.** `db.posts.find({ tags: "mongodb" })` does a COLLSCAN, and `tags` is an array. Which command creates the index that helps?
- A. `db.posts.createIndex({ tags: 1 })`
- B. `db.posts.createIndex({ tags: "multikey" })`
- C. `db.posts.createIndex({ "tags.$": 1 })`
- D. `db.posts.createIndex({ tags: "text" })`

<details><summary>Answer</summary>

**A.** A normal index on an array field automatically becomes multikey. *(3.2)*
</details>

**38.** Which indexes support `db.people.find().sort({ lastName: 1, firstName: -1 })`? *(Choose 2)*
- A. `{ lastName: 1, firstName: -1 }`
- B. `{ lastName: -1, firstName: 1 }`
- C. `{ lastName: 1, firstName: 1 }`
- D. `{ firstName: -1, lastName: 1 }`

<details><summary>Answer</summary>

**A, B.** The index must have the same directions or the exact inverse, in the same field order. *(3.3)*
</details>

**39.** On a new collection you run `createIndex({ email: 1 })` and `createIndex({ name: 1, age: -1 })`. How many indexes does the collection have?
- A. 1
- B. 2
- C. 3
- D. 4

<details><summary>Answer</summary>

**C.** Don't forget the default `_id` index. *(3.4)*
</details>

**40.** Which statements about indexes are true? *(Choose 2)*
- A. Each index adds overhead to inserts, updates and deletes.
- B. Indexes consume disk space and memory.
- C. Indexes make every query faster, including those that don't use them.
- D. Dropping an index causes the queries it supported to fail.

<details><summary>Answer</summary>

**A, B.** After an index is dropped, its queries still work but fall back to slower COLLSCANs. *(3.5)*
</details>

**41.** An `explain("executionStats")` shows `winningPlan.stage: "COLLSCAN"`, `nReturned: 5` and `totalDocsExamined: 50000`. What does this indicate?
- A. The query uses an index efficiently.
- B. No index supports the query; consider creating one on the filter fields.
- C. The query is covered.
- D. The collection has 5 documents.

<details><summary>Answer</summary>

**B.** *(3.6)*
</details>

### Section 4 — Data modeling

**42.** An e-commerce app has customers. Each customer has 1–3 addresses, always shown with the profile, and thousands of orders over time. How should you model this?
- A. Embed addresses and orders in the customer.
- B. Embed addresses; store orders in their own collection referencing `customerId`.
- C. Store addresses and orders in separate collections.
- D. Embed the customer inside every address.

<details><summary>Answer</summary>

**B.** Embed small data that's read together; reference unbounded data. *(4.1)*
</details>

**43.** Which design is an anti-pattern?
- A. Embedding 2–3 phone numbers in a user document.
- B. Pushing every sensor reading, forever, into one array of a single device document.
- C. Referencing comments from a separate collection.
- D. Duplicating a product name inside order items.

<details><summary>Answer</summary>

**B.** This is an unbounded array: the document keeps growing toward the 16 MB limit. D is the valid *extended reference* pattern. *(4.2)*
</details>

### Section 5 — Tools

**44.** You loaded the Atlas Sample Dataset. How do you see the first document of `sample_mflix.movies` in Atlas?
- A. Database → Browse Collections → `sample_mflix` → `movies`; the first document listed is shown at the top.
- B. Use the Atlas Search tab → Run query.
- C. Use the Metrics tab → Documents.
- D. Download a backup and open it.

<details><summary>Answer</summary>

**A.** Data Explorer = Browse Collections. *(5.1)*
</details>

### Section 6 — Node.js driver

**45.** What is the MongoDB Node.js driver?
- A. A GUI for managing databases.
- B. The official library that lets Node.js applications connect to and work with MongoDB.
- C. An ODM that enforces schemas (like Mongoose).
- D. A local MongoDB server for testing.

<details><summary>Answer</summary>

**B.** *(6.1)*
</details>

**46.** In an Express API, where should `new MongoClient(uri)` be created?
- A. Once at application startup, reused by all requests.
- B. Inside each route handler, closed at the end of the request.
- C. Once per collection.
- D. Before each query.

<details><summary>Answer</summary>

**A.** One client owns the connection pool and is safe to share. *(6.2)*
</details>

**47.** Which statements about `mongodb+srv://user:pass@cluster0.ab1cd.mongodb.net/shop?retryWrites=true` are true? *(Choose 2)*
- A. The hostname is resolved via DNS SRV records to find the cluster members.
- B. TLS is enabled by default.
- C. Port 27017 must be added after the hostname.
- D. `shop` is the username.

<details><summary>Answer</summary>

**A, B.** `+srv` URIs take no port; `/shop` is the default database. *(6.3)*
</details>

**48.** What are advantages of the driver's connection pool? *(Choose 2)*
- A. Reuses open connections, avoiding a new handshake and authentication for each operation.
- B. Caches query results on the client.
- C. Allows many concurrent operations while limiting the total connections (`maxPoolSize`).
- D. Encrypts the data stored on disk.

<details><summary>Answer</summary>

**A, C.** *(6.4)*
</details>

**49.** Which Node.js statements correctly insert documents? *(Choose 2)*
- A. `await coll.insertOne({ name: "pen" })`
- B. `await coll.insertMany([{ name: "pen" }, { name: "ink" }])`
- C. `await coll.insertMany({ name: "pen" }, { name: "ink" })`
- D. `await coll.insertOne({ name: "pen" }).toArray()`

<details><summary>Answer</summary>

**A, B.** insertMany needs an array; insert results are not cursors. *(6.5)*
</details>

**50.** Set `status: "inactive"` for **all** users whose `lastLogin` is before 2025. Which Node.js code should you use?
- A. `await users.updateOne({ lastLogin: { $lt: new Date("2025-01-01") } }, { $set: { status: "inactive" } })`
- B. `await users.updateMany({ lastLogin: { $lt: new Date("2025-01-01") } }, { $set: { status: "inactive" } })`
- C. `await users.updateMany({ lastLogin: { $lt: new Date("2025-01-01") } }, { status: "inactive" })`
- D. `await users.update({ lastLogin: { $lt: new Date("2025-01-01") } }, { $set: { status: "inactive" } }, { multi: true })`

<details><summary>Answer</summary>

**B.** A changes only one document; C has no operator; `update()` doesn't exist in the modern driver. *(6.6)*
</details>

**51.** After `const result = await coll.deleteMany({ expired: true })`, how do you get the number of deleted documents?
- A. `result.deletedCount`
- B. `result.n`
- C. `result.length`
- D. `result.deleted`

<details><summary>Answer</summary>

**A.** *(6.7)*
</details>

**52.** Which Node.js code returns an **array** of all products in category "office"?
- A. `await coll.find({ category: "office" })`
- B. `await coll.find({ category: "office" }).toArray()`
- C. `await coll.findMany({ category: "office" })`
- D. `await coll.findOne({ category: "office" }).toArray()`

<details><summary>Answer</summary>

**B.** `find()` returns a cursor, and `findMany` doesn't exist. *(6.8)*
</details>

**53.** Which `aggregate` call is equivalent to this MQL query?
```js
coll.find({ status: "A" }, { projection: { name: 1, _id: 0 } }).sort({ name: 1 })
```
- A. `coll.aggregate([{ $match: { status: "A" } }, { $sort: { name: 1 } }, { $project: { name: 1, _id: 0 } }])`
- B. `coll.aggregate([{ $project: { name: 1, _id: 0 } }, { $match: { status: "A" } }, { $sort: { name: 1 } }])`
- C. `coll.aggregate({ $match: { status: "A" } }, { $sort: { name: 1 } })`
- D. `coll.aggregate([{ $find: { status: "A" } }, { $sort: { name: 1 } }])`

<details><summary>Answer</summary>

**A.** In B, `$project` removes `status` before `$match`, so nothing matches. C isn't an array; `$find` doesn't exist. *(6.9, 6.10)*
</details>

---

**Score yourself:** count your correct answers. ≥ 45/53 (~85%) → you're likely ready. Below that, re-read the objectives in the parentheses of the answers you missed.

---

## 11. Tricky questions — edge cases (40)

> Candidates who passed say the real exam sticks to the objectives but tests their **edge cases**. Each question here targets one trap, and every answer explains **why** each option is right or wrong. Not real exam questions.

### Updates & upserts

**T1.** `products` has `{ _id: 1, sku: "A", qty: 5, created: ISODate("2025-01-01") }`. What is the document after this?
```js
db.products.updateOne(
  { sku: "A" },
  { $inc: { qty: 1 }, $setOnInsert: { created: ISODate("2026-11-03") } },
  { upsert: true }
)
```
- A. `qty: 6, created: 2026-11-03`
- B. `qty: 6, created: 2025-01-01`
- C. A second document is inserted.
- D. Error: `$setOnInsert` can't be combined with `$inc`.

<details><summary>Answer</summary>

**B.** The document exists, so this is an **update**, not an insert. `$setOnInsert` only runs when the upsert **inserts**; here it's ignored. `$inc` still applies. C is wrong because upsert only inserts when nothing matches; D is wrong because operators can be combined.
</details>

**T2.** `users` has `{ _id: 1, name: "Ana" }`. What happens with `updateOne({ _id: 1 }, { $push: { tags: "vip" } })`?
- A. Error: `tags` doesn't exist.
- B. `tags: "vip"` (a string)
- C. `tags: ["vip"]`
- D. Nothing changes.

<details><summary>Answer</summary>

**C.** `$push` on a **missing** field creates an array with that element. It only errors when the field exists and **isn't an array** (e.g. `tags: "x"`).
</details>

**T3.** Document `{ _id: 1, tags: ["a"] }`. What is `tags` after `{ $addToSet: { tags: ["b", "c"] } }`?
- A. `["a", "b", "c"]`
- B. `["a", ["b", "c"]]`
- C. `["b", "c"]`
- D. Error.

<details><summary>Answer</summary>

**B.** Without `$each`, the array is added as **one element**. To add each value: `{ $addToSet: { tags: { $each: ["b", "c"] } } }` → `["a", "b", "c"]`. The same applies to `$push`.
</details>

**T4.** Document `{ _id: 1, stock: null }`. What does `updateOne({ _id: 1 }, { $inc: { stock: 1 } })` do?
- A. `stock` becomes 1.
- B. `stock` stays `null`.
- C. Error: cannot apply `$inc` to a non-numeric value.
- D. `stock` is removed.

<details><summary>Answer</summary>

**C.** `null` is a value of type Null, not a number. A **missing** field would be created with 1, but a field holding `null` (or a string) makes `$inc` fail.
</details>

**T5.** Document `{ _id: 1, name: "Ana" }`. What is the result of `updateOne({ _id: 1 }, { $unset: { age: "" } })`?
- A. Error: `age` doesn't exist.
- B. `{ matchedCount: 1, modifiedCount: 0 }`
- C. `{ matchedCount: 0, modifiedCount: 0 }`
- D. `age: ""` is added.

<details><summary>Answer</summary>

**B.** The filter matched, but removing a field that isn't there changes nothing, so no error and `modifiedCount: 0`. The value given to `$unset` (`""`) is ignored.
</details>

**T6.** `inventory` has 3 documents with `status: "A"`, and one of them already has `flag: true`. What does `updateMany({ status: "A" }, { $set: { flag: true } })` return?
- A. `matchedCount: 3, modifiedCount: 3`
- B. `matchedCount: 3, modifiedCount: 2`
- C. `matchedCount: 2, modifiedCount: 2`
- D. `matchedCount: 1, modifiedCount: 1`

<details><summary>Answer</summary>

**B.** `matchedCount` counts docs passing the filter (3). `modifiedCount` counts docs that actually changed; one already had `flag: true`.
</details>

**T7.** `users` is empty. What does it contain after this?
```js
db.users.replaceOne({ _id: 5 }, { name: "Eva" }, { upsert: true })
```
- A. `{ _id: ObjectId(...), name: "Eva" }`
- B. `{ _id: 5, name: "Eva" }`
- C. Nothing — `replaceOne` doesn't support upsert.
- D. Error: the replacement has no `_id`.

<details><summary>Answer</summary>

**B.** On upsert, the equality on `_id` in the filter is used for the new document. `replaceOne` does support `upsert`.
</details>

**T8.** `users` is empty. What is inserted?
```js
db.users.updateOne({ "address.city": "GDL" }, { $set: { name: "Ana" } }, { upsert: true })
```
- A. `{ _id: ..., "address.city": "GDL", name: "Ana" }` (a field literally named with a dot)
- B. `{ _id: ..., address: { city: "GDL" }, name: "Ana" }`
- C. `{ _id: ..., name: "Ana" }`
- D. Error: dot notation isn't allowed in an upsert filter.

<details><summary>Answer</summary>

**B.** Dot notation in the filter is turned into a **nested** document on insert.
</details>

**T9.** Document `{ _id: 1, grades: [80, 85, 90, 85] }`. What is `grades` after this?
```js
db.students.updateOne({ _id: 1, grades: 85 }, { $set: { "grades.$": 86 } })
```
- A. `[80, 86, 90, 86]`
- B. `[80, 86, 90, 85]`
- C. `[86, 86, 86, 86]`
- D. Error.

<details><summary>Answer</summary>

**B.** The positional `$` updates only the **first** element that matched the filter. To change all 85s, use `"grades.$[g]"` with `arrayFilters: [{ g: 85 }]`.
</details>

**T10.** Document `{ _id: 1, scores: [40, 70, 30, 90] }`. What is `scores` after `{ $pull: { scores: { $lt: 50 } } }`?
- A. `[70, 30, 90]`
- B. `[70, 90]`
- C. `[40, 30]`
- D. Error: `$pull` needs an exact value.

<details><summary>Answer</summary>

**B.** `$pull` removes **every** element matching the condition (not just the first) and accepts query operators.
</details>

### Queries

**T11.** Document `{ _id: 1, items: [ { qty: 2, name: "pen" } ] }`. Which query matches it?
- A. `find({ items: { name: "pen", qty: 2 } })`
- B. `find({ items: { qty: 2, name: "pen" } })`
- C. Both A and B.
- D. Neither.

<details><summary>Answer</summary>

**B.** An embedded document used as a value must match **exactly, field order included**. A has the fields in a different order. Safer: `{ "items.name": "pen", "items.qty": 2 }` or `$elemMatch`.
</details>

**T12.** Given `{ _id: 1, x: null }`, `{ _id: 2 }`, `{ _id: 3, x: 5 }`. Which documents does `find({ x: { $exists: false } })` return?
- A. 1 and 2
- B. 2 only
- C. 1 only
- D. 1, 2 and 3

<details><summary>Answer</summary>

**B.** `$exists: false` means the field is **missing**. Doc 1 has `x` (its value is null). Compare: `{ x: null }` returns 1 **and** 2.
</details>

**T13.** Given `{ _id: 1, v: 5 }`, `{ _id: 2, v: 5.5 }`, `{ _id: 3, v: "5" }`, `{ _id: 4, v: NumberLong(5) }`. Which does `find({ v: { $type: "number" } })` return?
- A. 1 only
- B. 1 and 4
- C. 1, 2 and 4
- D. 1, 2, 3 and 4

<details><summary>Answer</summary>

**C.** `"number"` is an alias covering double, int, long and decimal. A string `"5"` is not a number.
</details>

**T14.** Given `{ _id: 1, a: 1 }`, `{ _id: 2, a: 2 }`, `{ _id: 3 }`. Which does `find({ $nor: [{ a: 1 }] })` return?
- A. 2 only
- B. 2 and 3
- C. 3 only
- D. 1 only

<details><summary>Answer</summary>

**B.** `$nor` (like `$ne`, `$nin`, `$not`) also matches documents **missing** the field.
</details>

**T15.** Which query is **invalid**?
- A. `find({ tags: { $size: 2 } })`
- B. `find({ tags: { $size: { $gt: 1 } } })`
- C. `find({ "tags.1": { $exists: true } })`
- D. `find({ tags: { $all: ["a"] } })`

<details><summary>Answer</summary>

**B.** `$size` only accepts an exact number. "More than one element" is written as C: element at index 1 exists.
</details>

**T16.** Given `{ _id: 1, qty: 10 }`, `{ _id: 2, qty: 20 }`, `{ _id: 3, qty: 30 }`. What does this return?
```js
db.c.find({ qty: { $gte: 20 }, qty: { $lte: 10 } })
```
- A. Nothing.
- B. 1 only.
- C. 2 and 3.
- D. Error: duplicate key.

<details><summary>Answer</summary>

**B.** The JS object has `qty` twice, so the **last one wins**: only `qty <= 10` is sent. No error is raised. Many expect A (impossible condition).
</details>

**T17.** Given `{ _id: 1, a: 5 }`, `{ _id: 2, a: "abc" }`, `{ _id: 3, a: true }`, `{ _id: 4, a: null }`, `{ _id: 5 }`. What is the order of `find().sort({ a: 1 })`?
- A. 4/5 (either order), 1, 2, 3
- B. 1, 2, 3, 4, 5
- C. 3, 1, 2, 4, 5
- D. 2, 1, 3, 4/5

<details><summary>Answer</summary>

**A.** BSON order: **Null (and missing) < Numbers < String < Object < Array < … < Boolean < Date**. Null and missing compare equal, so their relative order isn't guaranteed.
</details>

**T18.** Given `{ _id: 1, a: [1, 10] }`, `{ _id: 2, a: 5 }`, `{ _id: 3, a: [3, 4] }`. What is the order of `find().sort({ a: -1 })`?
- A. 1, 2, 3
- B. 2, 3, 1
- C. 3, 2, 1
- D. 1, 3, 2

<details><summary>Answer</summary>

**A.** Descending sort uses each array's **largest** element: 10, 5, 4. Ascending would use the **smallest**: 1, 3, 5 → order 1, 3, 2.
</details>

### Projection & cursors

**T19.** Document `{ _id: 1, name: "Ana", tags: ["a", "b", "c"], age: 30 }`. What does `find({}, { tags: { $slice: 1 } })` return?
- A. `{ _id: 1, tags: ["a"] }`
- B. `{ _id: 1, name: "Ana", tags: ["a"], age: 30 }`
- C. `{ tags: ["a"] }`
- D. Error: `$slice` needs another inclusion.

<details><summary>Answer</summary>

**B.** A projection that contains only `$slice` keeps **all other fields**; it just trims the array. `$slice: -2` would return the last two.
</details>

**T20.** Document `{ _id: 1, size: { h: 14, w: 21, uom: "cm" }, item: "x" }`. What does `find({}, { "size.uom": 0 })` return?
- A. `{ _id: 1, size: { h: 14, w: 21 }, item: "x" }`
- B. `{ _id: 1, item: "x" }`
- C. `{ size: { uom: "cm" } }`
- D. Error.

<details><summary>Answer</summary>

**A.** Exclusion with dot notation removes only that nested field.
</details>

**T21.** Index `{ email: 1 }` exists. Is `find({ email: "a@x.com" }, { email: 1 })` a covered query?
- A. Yes, `email` is in the index.
- B. No, `_id` is returned by default and isn't in the index.
- C. Yes, `_id` is always in every index.
- D. No, covered queries can't use equality.

<details><summary>Answer</summary>

**B.** It becomes covered with `{ email: 1, _id: 0 }`. Every filtered and returned field must be in the index.
</details>

### Aggregation

**T22.** Given `{ amt: 10 }`, `{ amt: 20 }`, `{ }`. What does this return?
```js
db.c.aggregate([{ $group: { _id: null, avg: { $avg: "$amt" }, n: { $sum: 1 } } }])
```
- A. `{ _id: null, avg: 10, n: 3 }`
- B. `{ _id: null, avg: 15, n: 3 }`
- C. `{ _id: null, avg: 15, n: 2 }`
- D. Error: a document is missing `amt`.

<details><summary>Answer</summary>

**B.** `$avg` **ignores** missing and non-numeric values (average of 10 and 20). `$sum: 1` counts every document in the group (3). `_id: null` = one group for everything.
</details>

**T23.** What does `aggregate([{ $group: { _id: "category", total: { $sum: "$price" } } }])` return when there are several categories?
- A. One document per category.
- B. One document `{ _id: "category", total: <sum of all prices> }`.
- C. Error: `_id` must start with `$`.
- D. Nothing.

<details><summary>Answer</summary>

**B.** Without `$`, `"category"` is a **literal string**, so every document falls into one group. Group by field = `"$category"`.
</details>

**T24.** Given `{ _id: 1, tags: ["a", "b"] }`, `{ _id: 2, tags: [] }`, `{ _id: 3 }`. How many documents does `aggregate([{ $unwind: "$tags" }])` output?
- A. 2
- B. 3
- C. 4
- D. 1

<details><summary>Answer</summary>

**A.** Doc 1 becomes 2 docs. Empty arrays and missing fields are **dropped** by default. Keep them with `{ $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }` → 4.
</details>

**T25.** Orders have `cust`, `amount` and `status`. What does this return?
```js
db.orders.aggregate([
  { $group: { _id: "$cust", total: { $sum: "$amount" } } },
  { $match: { status: "paid" } }
])
```
- A. Totals of paid orders per customer.
- B. Nothing.
- C. All totals.
- D. Error: `$match` must be first.

<details><summary>Answer</summary>

**B.** After `$group`, documents only have `_id` and `total`. `status` no longer exists, so nothing matches. Put `$match` **before** `$group`. `$match` can go anywhere, so D is wrong.
</details>

**T26.** `orders` has `{ _id: 3, qty: 5 }` (no `item`). `inventory` has `{ _id: 10, sku: "a" }` and `{ _id: 11, name: "misc" }` (no `sku`). What is `docs` for order 3?
```js
{ $lookup: { from: "inventory", localField: "item", foreignField: "sku", as: "docs" } }
```
- A. `[]`
- B. `[ { _id: 11, name: "misc" } ]`
- C. `null`
- D. Order 3 is removed.

<details><summary>Answer</summary>

**B.** A missing `localField` is treated as **null**, and it matches foreign documents whose `foreignField` is null or missing.
</details>

**T27.** Which pipeline is **invalid**?
- A. `[{ $match: { a: 1 } }, { $out: "res" }]`
- B. `[{ $out: "res" }, { $match: { a: 1 } }]`
- C. `[{ $group: { _id: "$a" } }, { $out: { db: "reports", coll: "res" } }]`
- D. `[{ $search: { text: { query: "x", path: "t" } } }, { $out: "res" }]`

<details><summary>Answer</summary>

**B.** `$out` (and `$merge`) must be the **last** stage. C writes to another database, which is allowed. D is valid: `$search` first, `$out` last.
</details>

**T28.** What does `aggregate([{ $match: { status: "A" } }, { $count: "total" }])` return when no documents match?
- A. `{ total: 0 }`
- B. No documents.
- C. `null`
- D. Error.

<details><summary>Answer</summary>

**B.** `$count` outputs nothing when no documents reach it. `countDocuments()` would return `0`.
</details>

### Atlas Search

**T29.** In a `compound` query, which clause is **required** but does **not** affect the relevance score?
- A. `must`
- B. `should`
- C. `filter`
- D. `mustNot`

<details><summary>Answer</summary>

**C.** `must` = required + scores; `should` = optional + boosts score; `mustNot` = excludes; `filter` = required, no scoring.
</details>

**T30.** The index maps `title` only as `{ "type": "string" }`. An `autocomplete` query on `title` doesn't work. Why?
- A. Autocomplete needs a `text` index.
- B. The field must be mapped with `"type": "autocomplete"`.
- C. Autocomplete only works with dynamic mappings.
- D. `$search` must come after `$match`.

<details><summary>Answer</summary>

**B.** Each operator needs a matching field type: `autocomplete` queries need an `autocomplete` mapping. Dynamic mappings don't create autocomplete fields either, so C is wrong.
</details>

**T31.** Which `fuzzy` setting is **invalid**?
- A. `fuzzy: { maxEdits: 1 }`
- B. `fuzzy: { maxEdits: 2 }`
- C. `fuzzy: { maxEdits: 3 }`
- D. `fuzzy: {}`

<details><summary>Answer</summary>

**C.** `maxEdits` can be 1 or 2 (default 2). An empty `fuzzy: {}` uses the defaults.
</details>

### Indexes

**T32.** Index `{ a: 1, b: 1 }` is the only index besides `_id`. How is `find({ b: 5 })` executed best?
- A. IXSCAN using the index efficiently.
- B. It can't use the index prefix, so it's typically a COLLSCAN (or a full index scan).
- C. Error: `b` isn't indexed alone.
- D. The index is rebuilt automatically.

<details><summary>Answer</summary>

**B.** A compound index supports queries on its **prefixes** (`a`, `a + b`), not on `b` alone. Add `{ b: 1 }` if this query is frequent.
</details>

**T33.** Only index: `{ createdAt: -1 }`. Can it support `find().sort({ createdAt: 1 })`?
- A. Yes, a single-field index can be traversed in either direction.
- B. No, directions must match.
- C. Only with `hint()`.
- D. Only if `createdAt` is unique.

<details><summary>Answer</summary>

**A.** Direction matters only for **compound** sorts on several fields.
</details>

**T34.** Index `{ tags: 1, categories: 1 }` exists. What happens when inserting `{ tags: ["a", "b"], categories: ["x", "y"] }`?
- A. It's inserted and indexed normally.
- B. Error: cannot index parallel arrays.
- C. Only `tags` is indexed.
- D. The index is dropped.

<details><summary>Answer</summary>

**B.** A compound multikey index can't have **two array fields in the same document**. One array per document is fine.
</details>

**T35.** A unique index exists on `email`. You insert `{ name: "A" }`, then `{ name: "B" }` (neither has `email`). What happens?
- A. Both are inserted.
- B. The second fails with a duplicate key error.
- C. Both fail.
- D. The index ignores documents missing the field.

<details><summary>Answer</summary>

**B.** Missing fields are indexed as `null`, so two docs without `email` duplicate the key `null`. Use a **partial** index (e.g. `partialFilterExpression: { email: { $exists: true } }`) to allow it.
</details>

**T36.** `explain("executionStats")` shows `IXSCAN` → `FETCH`, `totalKeysExamined: 1000`, `totalDocsExamined: 1000`, `nReturned: 10`. What does it suggest?
- A. The query is optimal.
- B. The index is used, but a filter field isn't in the index; a better compound index would reduce examined documents.
- C. The query is covered.
- D. The collection has 10 documents.

<details><summary>Answer</summary>

**B.** An index alone isn't enough. 1000 examined vs 10 returned means the other conditions are checked after fetching. Ideal: keys ≈ docs ≈ returned.
</details>

### Node.js driver

**T37.** `users` has `{ _id: ObjectId("65f1c2a1b2c3d4e5f6a7b8c9"), name: "Ana" }`. What does this return?
```js
await users.updateOne({ _id: "65f1c2a1b2c3d4e5f6a7b8c9" }, { $set: { name: "Eva" } });
```
- A. `matchedCount: 1, modifiedCount: 1`
- B. `matchedCount: 0, modifiedCount: 0`
- C. Error: invalid `_id`.
- D. The driver converts the string automatically.

<details><summary>Answer</summary>

**B.** A string is a different BSON type from an ObjectId, so nothing matches and **no error** is raised. Use `new ObjectId("65f1…")`.
</details>

**T38.** `items` already has `{ _id: 2 }`. What happens with this call?
```js
await items.insertMany([{ _id: 1 }, { _id: 2 }, { _id: 3 }]);
```
- A. Nothing is inserted.
- B. `_id: 1` is inserted, then a `MongoBulkWriteError` is thrown; `_id: 3` is not inserted.
- C. `_id: 1` and `_id: 3` are inserted, no error.
- D. All three are inserted, replacing `_id: 2`.

<details><summary>Answer</summary>

**B.** `insertMany` is **ordered by default**: it stops at the first error and doesn't roll back earlier inserts. With `{ ordered: false }`, `_id: 3` would also be inserted, but an error is **still thrown** for `_id: 2`.
</details>

**T39.** `counters` is empty. What does `doc` hold?
```js
const doc = await counters.findOneAndUpdate(
  { _id: "x" }, { $inc: { seq: 1 } }, { upsert: true }
);
```
- A. `{ _id: "x", seq: 1 }`
- B. `null`
- C. `{ upsertedId: "x" }`
- D. Error.

<details><summary>Answer</summary>

**B.** The default `returnDocument` is `"before"`, and before the upsert there was no document. The document is still inserted. Use `returnDocument: "after"` to get `{ _id: "x", seq: 1 }`.
</details>

**T40.** Which Node.js call returns only `name` from one document? *(Choose 2)*
- A. `await coll.findOne({ _id: id }, { projection: { name: 1, _id: 0 } })`
- B. `await coll.findOne({ _id: id }, { name: 1, _id: 0 })`
- C. `await coll.find({ _id: id }).project({ name: 1, _id: 0 }).next()`
- D. `await coll.findOne({ _id: id }).project({ name: 1 })`

<details><summary>Answer</summary>

**A, C.** In Node the second argument is **options**, so B's `{ name: 1 }` isn't a projection. D fails: `findOne` returns a Promise, which has no `.project()`. C works because `next()` returns the first document from the cursor.
</details>

---

**How to use this section:** if you miss one, re-read the matching part of the guide and run the example in mongosh or Node.js. Seeing the actual result is what makes edge cases stick.
