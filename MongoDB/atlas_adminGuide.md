# MongoDB Atlas Administrator Exam — Study Guide

> Built from the **official 2026 Atlas Administrator Exam Guide** + MongoDB docs. Same format as the Developer guide: explanations, examples, gotchas, and a 70-question mock exam with hidden answers.
> Atlas UI names and defaults change over time — confirm anything you plan to rely on in your own Atlas project.

---

## 0. Exam at a glance

| Item | Detail |
|---|---|
| Questions | **70** (some unscored, not identified) |
| Time | **95 minutes** (~80 s per question) |
| Types | Multiple choice (1 correct) and multiple response (2–3 correct; the prompt tells you how many) |
| Fee | USD $150 |
| Delivery | Online, proctored (ProctorU). No reference material. |
| Passing score | Not published. Only the **overall** score matters. |
| Retake | Wait **15 days** after a failed attempt. |
| Recommended | ~1 year hands-on with Atlas + the **MongoDB Atlas Administrator Path** (free) |

### Where the points are

| Domain | Weight | ≈ Questions |
|---|---|---|
| 2. Cluster Reliability and Data Resilience | **20%** | ~14 |
| 5. Performance Monitoring and Tuning | **20%** | ~14 |
| 6. Security, Networking, and Encryption | **20%** | ~14 |
| 1. MongoDB Architecture and Core Operations | 16% | ~11 |
| 3. Indexing and Query Optimization | 16% | ~11 |
| 4. Sharding Strategies and Scalable Deployments | 8% | ~6 |

**Takeaway:** Domains 1 and 3 (32%) overlap heavily with your Developer guide — CRUD, aggregation, indexes, ESR, explain. Study those once, use them twice. The new material is reliability, monitoring, security and sharding (68%).

---

## 1. MongoDB Architecture and Core Operations (16%)

This domain is the Developer exam in miniature. Review these sections of the Developer guide: **2.8–2.15** (queries, projection, sort), **2.3** (`$set`), **2.20** (aggregation), **4** (embed vs reference).

### 1.1–1.2 Aggregation pipelines and stage order

```js
db.orders.aggregate([
  { $match: { status: "paid" } },          // filter early (can use indexes)
  { $unwind: "$items" },                   // 1 doc per array element
  { $group: { _id: "$items.sku", qty: { $sum: "$items.qty" } } },
  { $project: { _id: 0, sku: "$_id", qty: 1 } },
  { $sort: { qty: -1 } },
  { $limit: 5 }
])
```

**Stage order changes the result** — the exam's favorite angle:

| Order | Effect |
|---|---|
| `$match` before `$group` | Filters input documents |
| `$match` after `$group` | Filters **groups**; only `_id` + accumulator fields exist now |
| `$project` removes a field, then `$match` on it | Matches nothing |
| `$limit: 5` then `$sort` | Sorts 5 arbitrary docs (not the top 5) |
| `$sort` then `$limit: 5` | Top 5 |
| `$unwind` then `$group` with `$sum: 1` | Counts **array elements**, not documents |

`$unwind` drops documents whose array is empty or missing (unless `preserveNullAndEmptyArrays: true`).

### 1.3 Queries

```js
db.c.find({ tags: "red" })                         // array contains "red"
db.c.find({ tags: ["red", "blue"] })               // exact array, same order
db.c.find({ qty: { $gte: 10, $lt: 50 } })          // range
db.c.find({ $or: [{ qty: { $lt: 5 } }, { status: "D" }] })
db.c.find({ $and: [{ $or: [...] }, { $or: [...] }] })  // explicit $and when keys repeat
```

### 1.4 Document model

- A **document database** stores data as JSON-like (BSON) documents with a flexible schema. Advantages over relational: data accessed together is stored together (fewer joins), maps naturally to objects in code, schema can evolve without migrations, scales horizontally via sharding.
- **Embed** when data is read together, one-to-few, and bounded. **Reference** when the related data is unbounded, large, shared, or accessed on its own.

### 1.5 Query options

```js
db.c.find({ status: "A" }, { name: 1, _id: 0 }).sort({ name: 1 }).limit(10)
db.c.countDocuments({ status: "A" })
```
No mixing `1` and `0` in a projection (except `_id: 0`). Sort → skip → limit regardless of chain order.

### 1.6 Update with `$set`

```js
db.users.updateOne({ _id: 1 }, { $set: { "address.city": "GDL", active: true } })
```
`$set` only touches listed fields and creates missing ones. Without an operator, `updateOne` errors.

---

## 2. Cluster Reliability and Data Resilience (20%)

### 2.3 Architecture for high availability

**Replica set** = a group of `mongod` nodes with the same data. Every Atlas cluster is at least a **3-node replica set**: 1 primary + 2 secondaries.

```
           writes/reads
 App ───────────────► PRIMARY ──oplog──► SECONDARY
                         │
                         └────oplog────► SECONDARY
```

- **Primary** takes all writes and records them in the **oplog** (operation log).
- **Secondaries** copy the oplog and replay it.
- If the primary fails, the secondaries hold an **election** and one becomes primary — automatic **failover**, usually in seconds.
- An election needs a **majority** of voting members. With 3 nodes, 1 can fail; with 5, 2 can fail. That's why electable nodes come in **odd numbers**.
- Apps keep working through failover by using the **SRV connection string** + **retryable writes/reads** (on by default in modern drivers).
- `w: "majority"` write concern = the write is acknowledged once most nodes have it, so it survives a failover. It's the Atlas default.

**Common cloud risks and how Atlas covers them:**

| Risk | Protection |
|---|---|
| Node/VM failure | Replica set failover |
| Availability zone (data center) outage | Atlas spreads nodes across **AZs** in a region (where the region has them) |
| Whole region outage | **Multi-region** cluster |
| Whole cloud provider outage | **Multi-cloud** cluster (AWS + Azure + GCP) |
| Human error (bad delete, bad migration) | **Backups** + point-in-time restore (replication copies the mistake too!) |

**Multi-region node types:**

| Node type | Votes / can be primary | Use |
|---|---|---|
| Electable | Yes | High availability |
| Read-only | No | Low-latency local reads in another region |
| Analytics | No | Isolate heavy analytics/BI from operational traffic (`readPreference=secondary` + tag `nodeType:ANALYTICS`) |

To survive a **full region outage**, electable nodes must be spread over **at least 3 regions** (e.g. 2 + 2 + 1), so a majority remains when any one region is down. With 2 regions (e.g. 3 + 2), losing the region with 3 nodes leaves no majority → no primary (read-only).

### 2.1 Identify and respond to cluster failures

**Methodology: Identify → Mitigate → Remediate**

| Step | Goal | Examples |
|---|---|---|
| **Identify** | Find what's wrong using metrics, alerts, logs | CPU at 100%, replication lag rising, connections maxed, disk full |
| **Mitigate** | Stop the bleeding quickly (short-term) | Scale up tier, kill a runaway operation, add storage, pause a batch job, fail over |
| **Remediate** | Fix the root cause (long-term) | Add the missing index, fix the query, change the schema, right-size the cluster, enable auto-scaling |

Exam pattern: a scenario + "what's the **first** / **immediate** action?" → mitigate. "How do you **prevent** it?" → remediate.

**Key cluster metrics to recognize:** CPU (process/system), memory, disk IOPS & latency, disk space used, connections, opcounters, query targeting, replication lag, oplog window, WiredTiger cache usage.

**Testing resilience:** Atlas lets you **Test Primary Failover** (forces an election) and simulate a **regional outage** on multi-region clusters. Use them to confirm the app handles failover.

### 2.2 Backups and compliance

**Atlas Cloud Backup** (dedicated clusters, M10+) takes **snapshots** using the cloud provider's snapshot tech.

| Feature | What it does |
|---|---|
| **Snapshot schedule / retention policy** | Hourly, daily, weekly, monthly snapshots with a retention per frequency (default policy: hourly every 6 h kept 2 days, daily kept 7 days, weekly kept 4 weeks, monthly kept 12 months — editable) |
| **On-demand snapshot** | Take one now (e.g. before a risky migration) |
| **Continuous Cloud Backup** | Keeps the oplog → **Point-in-Time (PIT) restore** to any moment in the restore window (down to the second) |
| **Multi-region snapshot distribution** | Copies snapshots to other regions (survive a region loss; data residency) |
| **Restore** | To the **same** cluster or **another** cluster in the same/other project (the target's data is **overwritten**) |
| **Backup Compliance Policy** | Project-level protection: backups can't be deleted or retention lowered, even by Project Owners; enforces minimum retention, PIT, encryption. Disabling it requires MongoDB Support |

**Choosing a strategy:**
- **RPO** (Recovery Point Objective) = how much data you can afford to lose → "zero/near-zero data loss" or "restore to just before the bad delete" → **Continuous Cloud Backup (PIT)**.
- **RTO** (Recovery Time Objective) = how fast you must be back.
- Regulations (finance, health) requiring retention, immutability → **Backup Compliance Policy** + long retention.
- Region-level disaster recovery → **multi-region snapshot distribution** (or a multi-region cluster).

**Operational safeguards / best practices:**
- Replication ≠ backup (a `deleteMany({})` replicates to all nodes in milliseconds).
- Take an on-demand snapshot before schema migrations or bulk changes.
- **Test restores** regularly (into a separate cluster), don't just trust the schedule.
- Enable **termination protection** on production clusters so they can't be deleted by accident.
- Monitor backup alerts (e.g. failed snapshot, PIT window issues).

### 2.4 Troubleshoot replication

**Replication lag** = how far a secondary is behind the primary (seconds).
**Oplog window** = how much time of history the oplog holds.

> If a secondary's lag becomes **larger than the oplog window**, the operations it needs are gone → it goes **stale** and needs a full **resync (initial sync)**.

**Common causes of lag:**
- Heavy write load (bulk imports, large `updateMany`) — secondaries can't apply fast enough.
- Secondary **resource bottleneck**: disk IOPS, CPU, memory.
- **Network latency** between regions.
- Long-running operations or large index builds on secondaries.
- Writes with `w: 1` bursting faster than secondaries replicate (`w: "majority"` naturally throttles).

**Where to look in Atlas:** Metrics → **Replication Lag**, **Replication Oplog Window**, **Oplog GB/Hour**; alerts on lag/oplog window; the `mongod` logs.

**Fixes:** scale up (more IOPS/CPU/RAM), throttle/batch bulk writes, use `w: "majority"`, increase oplog size (min oplog window setting), build indexes in a rolling fashion, move heavy reads to analytics nodes.

**Recurring failovers** usually mean the primary keeps becoming unhealthy:
- Resource exhaustion (memory/CPU spikes, disk full) → scale up / enable auto-scaling / fix the expensive query.
- Network instability between nodes or regions.
- Maintenance windows (Atlas applies patches with rolling restarts, which trigger elections — schedule them off-peak).
Remediate the root cause; just failing over again doesn't fix anything.

---

## 3. Indexing and Query Optimization (16%)

Review Developer guide **Section 3** (index types, ESR, prefixes, sort directions, explain). Extras for this exam:

### 3.1 Index costs and prefix alignment

- Every index speeds up some reads but **costs** on every write (insert/update/delete must update it), plus RAM and disk.
- Compound index `{ a: 1, b: 1, c: 1 }` serves queries on `a`, `a+b`, `a+b+c` (its **prefixes**). A query on `b` alone can't use it efficiently.
- `{ a: 1 }` is **redundant** when `{ a: 1, b: 1 }` exists → drop it (Performance Advisor flags these).

**ESR:** Equality fields → Sort fields → Range fields.
```js
find({ status: "A", qty: { $gt: 10 } }).sort({ date: -1 })   →   { status: 1, date: -1, qty: 1 }
```

### 3.2 Sort order, cardinality, value distribution

- **Cardinality** = number of distinct values. High cardinality (email, userId) = very **selective** → great index field. Low cardinality (boolean, status with 2 values) alone helps little.
- **Value distribution**: if 95% of docs have `status: "active"`, an index on `status` helps only when querying the rare values.
- **Sort order**: compound sorts need the same directions or the exact inverse (`{a:1,b:-1}` ↔ `{a:-1,b:1}`). Single-field index works either direction.
- Put the most selective **equality** fields first among the E fields.

### 3.3 Confirm the index with explain

```js
db.orders.find({ customerId: 42 }).explain("executionStats")
```

| Look for | Meaning |
|---|---|
| `IXSCAN` + `indexName: "customerId_1"` | ✅ expected index used |
| `COLLSCAN` | ❌ no index |
| `SORT` stage | in-memory sort (index doesn't cover the sort) |
| `totalKeysExamined` ≈ `totalDocsExamined` ≈ `nReturned` | efficient |
| examined ≫ returned | poor selectivity / wrong index |
| `rejectedPlans` | other candidate indexes the planner didn't choose |

### 3.4 Architecture components that affect performance

| Component | Key idea |
|---|---|
| **Vertical scaling** | Bigger tier (more CPU/RAM/IOPS). In Atlas: change tier (rolling, no downtime) or **auto-scaling** |
| **Horizontal scaling** | **Sharding**: spread data and load across shards |
| **Storage engine** | **WiredTiger**: document-level concurrency, compression, in-memory **cache** (default ~50% of (RAM − 1 GB)) |
| **Document model** | Good schema avoids `$lookup`s and huge documents; bad schema (unbounded arrays, bloated docs) hurts every query |
| **Query planner** | Picks the best index by trialing candidate plans and caching the winner per **query shape** |

Optimization options when explain shows a slow query: **create/adjust an index**, **modify the query** (add equality filters, projection, avoid unanchored regex/`$where`), or **change the data model**.

### 3.5 Creating indexes in Atlas

- Ways: Data Explorer (Indexes tab), mongosh/driver `createIndex()`, **Performance Advisor** one-click from a recommendation, Atlas CLI/API.
- **Rolling index build** option in Atlas: builds on one node at a time (secondaries first) to reduce impact on a busy cluster — slower overall, but safer.
- Index builds on large collections use resources: schedule off-peak, watch replication lag.
- Reads get faster; **writes get slightly slower** with each index. "Improve write performance" → **drop unused/redundant indexes**.

---

## 4. Sharding Strategies and Scalable Deployments (8%)

### 4.1 Architecture

```
            App
             │
          mongos (query routers)
        ┌────┼────────────┐
      Shard A   Shard B   Shard C     ← each shard is a replica set
             config servers           ← metadata: which ranges/chunks live where
```

- **Shard key**: field(s) used to split a collection's data.
- Data is split into **chunks** (ranges of shard key values). The **balancer** moves chunks between shards to keep them even.
- **Targeted query**: includes the shard key → mongos sends it to the right shard(s). **Scatter-gather**: no shard key → sent to all shards (slower).
- In Atlas, sharded clusters require **M30 or higher**; the mongos/config servers are managed for you.
- Shard when one replica set can't handle the data size or write throughput anymore (after vertical scaling makes sense first).

### 4.2 Strategies and choosing a shard key

| Strategy | How | Good for | Watch out |
|---|---|---|---|
| **Ranged** | Contiguous ranges of key values | Range queries on the key | Monotonic keys (timestamps, ObjectId) → all inserts hit the **last chunk** = **hot shard** |
| **Hashed** | Hash of the key value | Even write distribution with monotonic keys | Range queries on the key become scatter-gather |
| **Zoned** | Ranges pinned to specific shards | Data locality / residency (EU data in EU) — Atlas **Global Clusters** | More design work |

**A good shard key has:**
1. **High cardinality** — many distinct values (so data can split into many chunks).
2. **Low frequency** — no single value is extremely common (avoid "jumbo chunks").
3. **Non-monotonic** change — values don't always increase (or use hashed).
4. **Supports the main queries** — most queries include it → targeted.

Example: orders app, queries by customer → `{ customerId: 1, orderDate: 1 }` (high cardinality, targeted by customer, no single hot value). Bad: `{ country: 1 }` (low cardinality), `{ createdAt: 1 }` ranged (monotonic → hot shard), `{ status: 1 }` (few values).

### 4.3 Fixing a bad shard key

| Symptom | Likely cause |
|---|---|
| One shard gets most writes (hot shard) | Monotonic ranged key |
| Jumbo chunks that can't be split/moved | Low cardinality or high frequency value |
| Most queries hit every shard | Queries don't include the shard key |

**Fixes:**
- `refineCollectionShardKey` — **add suffix fields** to the existing key (e.g. `{ customerId: 1 }` → `{ customerId: 1, orderId: 1 }`) to raise cardinality. Can only add fields to the end.
- `reshardCollection` (MongoDB 5.0+) — change to a **completely new** shard key, online.
- Change queries to include the shard key.

---

## 5. Performance Monitoring and Tuning (20%)

### 5.1 Key metrics for query performance

| Metric | What it tells you |
|---|---|
| **Opcounters** | Operations per second by type (insert, query, update, delete, getmore, command) |
| **Query Targeting** | Documents (or keys) **scanned ÷ returned**. 1 is ideal; high values (Atlas default alert > **1000**) = missing/poor indexes |
| **Operation Execution Time** | Average latency of reads/writes/commands |
| **Query Executors / Scan and Order** | Scanned objects; in-memory sorts |
| **CPU (process/system)** | Expensive queries, too-small tier |
| **Disk IOPS / Disk latency / Disk queue** | Storage bottleneck |
| **Memory / Cache** | Working set vs RAM, WiredTiger cache used/dirty |
| **Connections** | Connection leaks, missing pooling, near the tier's limit |
| **Replication lag / oplog window** | Replication health |

### 5.2 Atlas monitoring tools

| Tool | Use it to… |
|---|---|
| **Metrics** charts | See trends over time for all of the above |
| **Real-Time Performance Panel (RTPP)** | Watch live operations, hottest collections, slowest ops **right now**; can kill ops |
| **Query Profiler** | Find **slow operations** (above the slow threshold) over a time range, per namespace; scatter chart of op duration |
| **Query Insights** (Namespace Insights / query shape insights) | Latency and op counts per collection and per query shape over time |
| **Performance Advisor** | Analyzes slow queries and **recommends indexes** (with impact estimate), flags **redundant/unused indexes** to drop, and gives **schema suggestions** |
| **Data Explorer** | Browse data, run queries/aggregations, manage indexes |

Performance Advisor workflow: open it → review **suggested index** (shows the query shapes it helps, avg time, docs scanned vs returned) → create it (optionally rolling build) → verify with Query Targeting / Profiler that latency dropped.

### 5.3 Alerts

- Configured per **project** (Project → Alerts → Alert Settings). Atlas ships default alerts; you add/edit your own.
- Parts of an alert: **condition** (metric + threshold, e.g. "Query Targeting > 1000", "Disk space used > 90%", "Replication lag > 60 s", "Connections > 80%") + **duration** + **notification target(s)** + resend interval.
- Notification channels: email, SMS, Atlas users/teams/roles, **Slack, PagerDuty, Opsgenie, Microsoft Teams, Datadog, webhook**, etc.
- Alert states: open → acknowledged (silenced for a period) → closed when the condition clears.

**Effective monitoring strategy:**
- Alert on **leading indicators** (disk 80%, lag rising, query targeting) before outages, not just on "cluster down".
- Route alerts to the **on-call team's** channel (PagerDuty/Slack), not one person's inbox.
- Avoid alert fatigue: sensible thresholds + durations.
- Establish a **baseline** of normal metrics so anomalies are obvious.
- Combine alerts + dashboards + periodic Performance Advisor review.

### 5.4 Profiling

**Profiling** records details of operations so you can find and analyze slow ones (what query, which plan, docs examined, duration).

- Database profiler levels: **0** off, **1** only slow ops (above `slowms`, default **100 ms**), **2** all ops (high overhead — avoid in production).
- In Atlas, the **Query Profiler** shows slow operations from the logs without you turning on level 2; Atlas manages the slow threshold.
- Benefits: pinpoints the exact slow queries, their shapes and plans → leads to index or query fixes; trends show regressions after deploys.

### 5.5 Cache and resource bottlenecks

- **WiredTiger cache** holds recently used data and indexes in RAM. The **working set** (frequently accessed data + indexes) should **fit in memory**.
- When it doesn't: more reads from disk → higher **disk IOPS/latency**, **cache eviction** pressure, higher dirty cache %, slow queries.
- Symptoms by resource:

| Bottleneck | Symptom | Typical fix |
|---|---|---|
| **Memory/cache** | Cache full, high eviction, disk reads up | Scale up tier (more RAM), reduce working set (drop unused indexes, projection, archive old data) |
| **CPU** | CPU near 100%, high query targeting | Add indexes, fix queries, scale up |
| **Disk IOPS** | Disk queue/latency high | Provisioned IOPS / higher tier, fewer scans (indexes) |
| **Disk space** | Space used near limit | Storage auto-scaling, delete/archive data |
| **Connections** | Near tier limit | Reuse one `MongoClient` (pooling), lower `maxPoolSize`, fix leaks |

- **Auto-scaling** (M10+): compute (tier up/down within a range) and storage (grow disk automatically).

---

## 6. Security, Networking, and Encryption (20%)

Atlas security layers: **network access** → **authentication** → **authorization (RBAC)** → **encryption** (in transit + at rest) → auditing.

### 6.1 Encryption at rest with cloud KMS

- All Atlas cluster storage is **encrypted at rest by default** (cloud provider disk encryption).
- For control over keys: **Encryption at Rest using Customer Key Management** — **AWS KMS**, **Azure Key Vault**, or **Google Cloud KMS** — which uses the **WiredTiger Encrypted Storage Engine** with your key.
- Steps: configure the KMS key + access for Atlas at the **project** level (Advanced → Encryption at Rest) → enable it **per cluster** (M10+).
- If you revoke/disable the key, Atlas can't read the data → the cluster becomes unavailable. Key rotation is supported.
- Encryption **in transit**: TLS is always on (can't be disabled).
- Field-level protection inside the app: **Client-Side Field Level Encryption** / **Queryable Encryption** (data is encrypted before it reaches Atlas).

### 6.2 IP Access List

- Atlas **denies all connections by default**. Only addresses in the project's **IP Access List** can connect.
- Entries: a single IP (`203.0.113.10`) or a **CIDR block** (`203.0.113.0/24`). Entries can be **temporary** (auto-expire).
- Applies to the whole **project** (all its clusters).
- `0.0.0.0/0` allows **any IP** — avoid in production; authentication becomes the only barrier.
- Remove entries when servers/people no longer need access. Adding/removing: Atlas UI (Network Access), Atlas CLI (`atlas accessLists create/delete`), Admin API.

### 6.3 Network peering and Private Endpoints

| Option | What it is | Notes |
|---|---|---|
| **Public + IP Access List** | Traffic over the internet (TLS) | Simplest |
| **Network peering** (VPC peering on AWS/GCP, VNet peering on Azure) | Connects your cloud network to the Atlas network using **private IPs** | Both sides route to each other; CIDRs must not overlap; add the peer's CIDR/security group to the access list |
| **Private Endpoint** (AWS PrivateLink, Azure Private Link, GCP Private Service Connect) | A private interface in **your** network that connects **one way** to Atlas | Traffic never crosses the public internet; Atlas can't initiate connections into your network; no CIDR overlap problems — **recommended** for secure production connectivity |

Why it matters: removes exposure to the public internet, simplifies compliance, and reduces attack surface.

### 6.4 Atlas users vs database users

| | **Atlas users** | **Database users** |
|---|---|---|
| Access | Atlas **UI / Admin API / CLI** (manage projects, clusters, billing) | **Connect to clusters** and read/write data (apps, mongosh, Compass) |
| Scope | Organization and/or project roles | Project (all clusters in the project, or restricted to some) |
| Authentication | Username/password + **MFA**, Google/GitHub, **Federated SSO (SAML)** | **SCRAM** (password), **X.509** certificates, **AWS IAM**, **LDAP**, **OIDC / Workload Identity Federation** |
| Roles | Organization Owner/Member/Read Only/Billing Admin; Project Owner, Project Cluster Manager, Project Data Access Admin/Read Write/Read Only, Project Read Only… | `atlasAdmin`, `readWriteAnyDatabase`, `readAnyDatabase`, `read`/`readWrite` on a db or collection, **custom roles** |

Key trap: an Atlas user (even Project Owner) **can't** log into the database with their Atlas password; you need a **database user**. And a database user can't open the Atlas UI.

**RBAC** (role-based access control) = permissions are grouped into **roles**, and users get roles (not individual permissions). A role = **privileges** (actions on resources) + optionally inherited roles.

### 6.5 Custom roles and least privilege

**Least privilege**: give each user only what it needs. The reporting app gets read on `sales`, not `atlasAdmin`.

Custom role (Atlas UI: Database Access → Custom Roles), conceptually:
```js
// role "ordersWriter"
privileges: [
  { resource: { db: "shop", collection: "orders" }, actions: ["find", "insert", "update"] }
]
// no "remove", no other collections
```
Then assign it to a database user. Built-in role scoping examples: `read@analytics`, `readWrite@shop`.

Best practices: one database user per application/service, no shared admin users, rotate passwords or use X.509/IAM/OIDC (no static passwords), use temporary users for one-off access.

---

## 7. Top gotchas — read the night before

1. Atlas clusters are at least **3-node replica sets**; elections need a **majority** → odd number of electable nodes.
2. Survive a **region** outage → electable nodes in **≥ 3 regions**.
3. Read-only and analytics nodes **don't vote** and can't become primary.
4. **Replication isn't backup.** Bad deletes replicate instantly.
5. Restore to just before a mistake / minimal data loss → **Continuous Cloud Backup (PIT)**.
6. Immutable backups for regulators → **Backup Compliance Policy**.
7. Lag > oplog window → secondary goes **stale** → resync.
8. **Identify → Mitigate → Remediate**: "immediate" = mitigate; "prevent" = remediate.
9. Index helps reads, **costs writes**. Drop redundant prefixes.
10. ESR; prefixes; compound sort needs same or inverse directions.
11. **Query Targeting** high (> 1000) = scanning far more than returning → index.
12. **Performance Advisor** = index suggestions + drop unused/redundant + schema advice.
13. **RTPP** = what's happening **now**; **Query Profiler** = slow ops over a time range.
14. Profiler level 2 logs everything → overhead. `slowms` default 100 ms.
15. Working set should fit in RAM; cache pressure → scale up or shrink the working set.
16. Monotonic **ranged** shard key → hot shard. **Hashed** spreads writes but breaks ranges.
17. Shard key: high cardinality, low frequency, non-monotonic, used by queries.
18. `refineCollectionShardKey` adds suffix fields; `reshardCollection` changes the key.
19. Atlas sharding needs **M30+**.
20. IP Access List: deny by default; `0.0.0.0/0` = everyone; project-wide.
21. **Private Endpoint** = one-way, private, recommended; **peering** = two-way, CIDRs can't overlap.
22. Customer-managed keys: configure in the **project**, enable **per cluster**; revoke key → cluster unavailable.
23. Atlas users manage Atlas; **database users** access data.
24. Custom role = actions on resources; assign the **least** privilege.

---

## 8. Mock exam — 70 questions

> Not the real exam questions (those are confidential). Same format and weights as the official guide; each answer explains why. Time yourself: **95 minutes**. Then take the **official Atlas Administrator Practice Questions** in MongoDB University.

### Domain 1 — Architecture and Core Operations

**1.** Given `{ sku: "a", qty: 2 }`, `{ sku: "b", qty: 5 }`, `{ sku: "a", qty: 4 }`, what does this return?
```js
db.sales.aggregate([{ $group: { _id: "$sku", total: { $sum: "$qty" } } }, { $match: { total: { $gt: 5 } } }])
```
- A. `{ _id: "a", total: 6 }`
- B. `{ _id: "a", total: 6 }`, `{ _id: "b", total: 5 }`
- C. Nothing.
- D. `{ sku: "a", total: 6 }`

<details><summary>Answer</summary>

**A.** `$match` after `$group` filters the **groups**: a = 6 passes, b = 5 doesn't (`$gt`). The key is `_id`, not `sku`. *(1.1)*
</details>

**2.** Orders have an `items` array. Which pipeline counts **items** (not orders) per status?
- A. `[{ $group: { _id: "$status", n: { $sum: 1 } } }]`
- B. `[{ $unwind: "$items" }, { $group: { _id: "$status", n: { $sum: 1 } } }]`
- C. `[{ $group: { _id: "$status", n: { $sum: 1 } } }, { $unwind: "$items" }]`
- D. `[{ $project: { status: 1 } }, { $unwind: "$items" }, { $group: { _id: "$status", n: { $sum: 1 } } }]`

<details><summary>Answer</summary>

**B.** `$unwind` first creates one doc per item, so `$sum: 1` counts items. C unwinds after `items` is gone; D's `$project` removes `items`. *(1.1, 1.2)*
</details>

**3.** You need the 3 highest-scoring players. Which pipeline is correct?
- A. `[{ $limit: 3 }, { $sort: { score: -1 } }]`
- B. `[{ $sort: { score: -1 } }, { $limit: 3 }]`
- C. `[{ $sort: { score: 1 } }, { $limit: 3 }]`
- D. `[{ $group: { _id: "$score" } }, { $limit: 3 }]`

<details><summary>Answer</summary>

**B.** In a pipeline, **order matters**: A sorts 3 arbitrary documents. (In `find()` the server reorders sort/limit, but pipeline stages run in sequence.) *(1.2)*
</details>

**4.** Which statement about aggregation is true?
- A. Stages run in parallel, so order doesn't matter.
- B. Each stage's output is the next stage's input, so order affects results and performance.
- C. Aggregation can only filter documents.
- D. `$match` can only be the first stage.

<details><summary>Answer</summary>

**B.** *(1.2)*
</details>

**5.** Given `{ _id: 1, tags: ["db", "cloud"] }`, `{ _id: 2, tags: ["cloud"] }`, `{ _id: 3, tags: ["db"] }`. Which documents does `find({ tags: "cloud" })` return?
- A. 2 only
- B. 1 and 2
- C. 1, 2 and 3
- D. None

<details><summary>Answer</summary>

**B.** A scalar value matches arrays that **contain** it. *(1.3)*
</details>

**6.** Which query returns documents with `qty` between 10 (inclusive) and 20 (exclusive) **or** `status: "urgent"`?
- A. `find({ qty: { $gte: 10, $lt: 20 }, status: "urgent" })`
- B. `find({ $or: [{ qty: { $gte: 10, $lt: 20 } }, { status: "urgent" }] })`
- C. `find({ $or: [{ qty: { $gt: 10, $lte: 20 } }, { status: "urgent" }] })`
- D. `find({ qty: { $gte: 10 }, qty: { $lt: 20 }, $or: [{ status: "urgent" }] })`

<details><summary>Answer</summary>

**B.** A is AND; C has the wrong bounds; D's duplicate `qty` key keeps only the last condition. *(1.3)*
</details>

**7.** Which are advantages of the document model over a relational model? *(Choose 2)*
- A. Data accessed together can be stored together, reducing joins.
- B. Every document in a collection must have identical fields.
- C. The flexible schema can evolve without migrations of the whole table.
- D. It doesn't support indexes, so writes are faster.

<details><summary>Answer</summary>

**A, C.** *(1.4)*
</details>

**8.** A product has 5 specs always shown with it, and millions of page-view events. How should you model it?
- A. Embed specs and events.
- B. Embed specs; store events in a separate collection referencing the product.
- C. Reference specs; embed events.
- D. Separate collections for both.

<details><summary>Answer</summary>

**B.** Embed small, bounded data read together; reference unbounded data. *(1.4)*
</details>

**9.** Which returns the number of active users?
- A. `db.users.find({ active: true }).limit(1)`
- B. `db.users.countDocuments({ active: true })`
- C. `db.users.find({ active: true }, { count: 1 })`
- D. `db.users.estimatedDocumentCount({ active: true })`

<details><summary>Answer</summary>

**B.** `estimatedDocumentCount` ignores filters. *(1.5)*
</details>

**10.** Which projection is invalid?
- A. `{ name: 1, email: 1 }`
- B. `{ name: 1, _id: 0 }`
- C. `{ password: 0 }`
- D. `{ name: 1, password: 0 }`

<details><summary>Answer</summary>

**D.** No mixing inclusion and exclusion (except `_id`). *(1.5)*
</details>

**11.** `{ _id: 1, name: "Ana", plan: "free" }`. Which command changes only `plan` to "pro"?
- A. `updateOne({ _id: 1 }, { plan: "pro" })`
- B. `updateOne({ _id: 1 }, { $set: { plan: "pro" } })`
- C. `replaceOne({ _id: 1 }, { plan: "pro" })`
- D. `updateOne({ _id: 1 }, { $set: { _id: 1, plan: "pro" }, name: "Ana" })`

<details><summary>Answer</summary>

**B.** A errors (no operator); C removes `name`; D mixes an operator with a plain field (error). *(1.6)*
</details>

### Domain 2 — Cluster Reliability and Data Resilience

**12.** What is the minimum topology of an Atlas dedicated cluster?
- A. A single node.
- B. A 3-node replica set (1 primary, 2 secondaries).
- C. A 2-node replica set.
- D. A sharded cluster with 2 shards.

<details><summary>Answer</summary>

**B.** *(2.3)*
</details>

**13.** In a 5-node replica set, how many voting members can fail while still electing a primary?
- A. 1
- B. 2
- C. 3
- D. 4

<details><summary>Answer</summary>

**B.** A majority (3 of 5) must remain. *(2.3)*
</details>

**14.** A company needs its cluster to keep accepting writes even if an **entire cloud region** goes down. Which configuration should you use?
- A. 3 electable nodes in one region, spread over availability zones.
- B. 5 electable nodes: 3 in region A, 2 in region B.
- C. 5 electable nodes: 2 in region A, 2 in region B, 1 in region C.
- D. 3 electable nodes in region A + 2 read-only nodes in region B.

<details><summary>Answer</summary>

**C.** With 3 regions, losing any one still leaves a majority (≥ 3 of 5). In B, losing region A leaves 2 of 5 → no primary. AZs (A) protect from a data-center failure, not a region. Read-only nodes (D) don't vote. *(2.3)*
</details>

**15.** Which statements about read-only and analytics nodes are true? *(Choose 2)*
- A. They can become primary during failover.
- B. They don't participate in elections.
- C. Analytics nodes isolate heavy reporting queries from operational traffic.
- D. They increase write throughput.

<details><summary>Answer</summary>

**B, C.** *(2.3)*
</details>

**16.** Which protects against a cloud provider–wide outage?
- A. Increasing the cluster tier.
- B. A multi-cloud cluster with electable nodes on more than one provider.
- C. Adding analytics nodes.
- D. Continuous Cloud Backup.

<details><summary>Answer</summary>

**B.** Backups help you recover data, but don't keep the cluster available. *(2.3)*
</details>

**17.** What lets an application keep working with minimal errors during an Atlas primary failover? *(Choose 2)*
- A. Connecting with the SRV connection string so the driver discovers the new primary.
- B. Retryable writes enabled in the driver.
- C. Hard-coding the primary's hostname.
- D. Using `w: 0` write concern.

<details><summary>Answer</summary>

**A, B.** Hard-coding a host breaks when the primary changes; `w: 0` gives no acknowledgment at all. *(2.3)*
</details>

**18.** CPU on the primary jumps to 100% due to a new unindexed query, and the app is timing out. Following Identify → Mitigate → Remediate, what is the best **mitigation** step?
- A. Rewrite the data model.
- B. Kill the runaway operations or temporarily scale up the tier.
- C. Wait for the next maintenance window.
- D. Delete the collection.

<details><summary>Answer</summary>

**B.** Mitigation is quick relief. The **remediation** is creating the right index / fixing the query. *(2.1)*
</details>

**19.** In the same scenario, what is the **remediation**?
- A. Keep the cluster on a bigger tier permanently.
- B. Create the index the query needs (e.g. from Performance Advisor) and verify with explain.
- C. Trigger a failover.
- D. Turn off alerts.

<details><summary>Answer</summary>

**B.** Remediate = fix the root cause. *(2.1)*
</details>

**20.** You want to confirm your application handles a primary failover before going to production. What should you do?
- A. Delete the primary node in the cloud console.
- B. Use Atlas **Test Primary Failover**.
- C. Reduce the tier to M0.
- D. Pause the cluster.

<details><summary>Answer</summary>

**B.** *(2.1, 2.3)*
</details>

**21.** A developer ran `deleteMany({})` on production 20 minutes ago. Which feature restores data to the moment just before it?
- A. Replica set failover.
- B. Continuous Cloud Backup point-in-time restore.
- C. Restoring last week's weekly snapshot.
- D. Multi-region cluster.

<details><summary>Answer</summary>

**B.** PIT restore gives the smallest data loss; the delete already replicated to all nodes, and a weekly snapshot would lose more data. *(2.1, 2.2)*
</details>

**22.** A bank must guarantee that backups can't be deleted or have their retention reduced, even by Project Owners. What should you enable?
- A. Termination protection.
- B. Backup Compliance Policy.
- C. Multi-region snapshot distribution.
- D. Database auditing.

<details><summary>Answer</summary>

**B.** Termination protection prevents **cluster** deletion, not backup changes. *(2.2)*
</details>

**23.** You must be able to restore backups even if the cluster's primary region is lost. What should you configure?
- A. A longer hourly retention.
- B. Multi-region snapshot distribution (copy snapshots to other regions).
- C. On-demand snapshots.
- D. More read-only nodes.

<details><summary>Answer</summary>

**B.** *(2.2)*
</details>

**24.** Before running a risky schema migration this afternoon, what's the best practice?
- A. Rely on the next scheduled snapshot.
- B. Take an on-demand snapshot right before the migration.
- C. Disable backups to speed up the migration.
- D. Fail over the cluster.

<details><summary>Answer</summary>

**B.** *(2.1, 2.2)*
</details>

**25.** Which are backup best practices? *(Choose 2)*
- A. Regularly test restores into a separate cluster.
- B. Treat the replica set as the backup.
- C. Align snapshot frequency and retention with the RPO and compliance needs.
- D. Restore directly into production to test.

<details><summary>Answer</summary>

**A, C.** Restoring overwrites the target cluster — never test on production. *(2.2)*
</details>

**26.** A secondary's replication lag grows until it exceeds the oplog window. What happens?
- A. It becomes primary.
- B. It goes stale and needs a full resync (initial sync).
- C. The primary pauses writes until it catches up.
- D. Nothing; it catches up automatically from the primary's data files.

<details><summary>Answer</summary>

**B.** The operations it needed are no longer in the oplog. *(2.4)*
</details>

**27.** Which are common causes of replication lag? *(Choose 3)*
- A. A large bulk write load.
- B. Secondaries with insufficient disk IOPS.
- C. High network latency between regions.
- D. Too many database users.
- E. Using the SRV connection string.

<details><summary>Answer</summary>

**A, B, C.** *(2.4)*
</details>

**28.** Which Atlas metrics help diagnose replication problems? *(Choose 2)*
- A. Replication Lag
- B. Replication Oplog Window
- C. Billing Usage
- D. Search Index Size

<details><summary>Answer</summary>

**A, B.** *(2.4)*
</details>

**29.** A nightly import with `w: 1` makes secondaries fall several minutes behind. Which change best reduces lag?
- A. Use `w: 0`.
- B. Use `w: "majority"` and batch the import so writes are paced by replication.
- C. Remove secondaries.
- D. Add more IP Access List entries.

<details><summary>Answer</summary>

**B.** `w: "majority"` makes writes wait for most nodes, naturally throttling the import. *(2.4)*
</details>

**30.** A cluster has several unplanned failovers per week, each when memory spikes during peak hours. What is the best remediation?
- A. Manually trigger more failovers.
- B. Investigate and fix the resource exhaustion: optimize the expensive queries and/or scale up or enable compute auto-scaling.
- C. Disable alerts on elections.
- D. Convert secondaries to read-only nodes.

<details><summary>Answer</summary>

**B.** Recurring failovers are a symptom; fix the cause. *(2.4)*
</details>

**31.** Atlas applies maintenance with rolling restarts. What should you do to minimize the impact?
- A. Disable maintenance permanently.
- B. Configure a preferred maintenance window during off-peak hours and make sure apps handle elections.
- C. Use a single-node cluster.
- D. Turn off retryable writes.

<details><summary>Answer</summary>

**B.** *(2.2, 2.4)*
</details>

**32.** Which statement about replication and data durability is true?
- A. Writes acknowledged with `w: "majority"` won't be rolled back after a failover.
- B. Writes acknowledged with `w: 1` are always on all secondaries.
- C. Replication protects against accidental deletes.
- D. Secondaries accept writes by default.

<details><summary>Answer</summary>

**A.** *(2.3)*
</details>

**33.** What does an RPO of "5 minutes" mean?
- A. The cluster must be back online within 5 minutes.
- B. You can afford to lose at most 5 minutes of data.
- C. Snapshots are kept for 5 minutes.
- D. Failover takes 5 minutes.

<details><summary>Answer</summary>

**B.** RTO is the time to recover; RPO is the amount of data loss. Hourly snapshots wouldn't meet this; continuous backup would. *(2.1)*
</details>

### Domain 3 — Indexing and Query Optimization

**34.** Which index best supports `find({ status: "open", priority: { $gte: 3 } }).sort({ createdAt: -1 })`?
- A. `{ priority: 1, status: 1, createdAt: -1 }`
- B. `{ status: 1, createdAt: -1, priority: 1 }`
- C. `{ createdAt: -1 }`
- D. `{ status: 1, priority: 1 }`

<details><summary>Answer</summary>

**B.** ESR: Equality, Sort, Range. *(3.1)*
</details>

**35.** Indexes `{ a: 1 }` and `{ a: 1, b: 1 }` exist. What should you do to improve write performance without hurting reads?
- A. Drop `{ a: 1, b: 1 }`.
- B. Drop `{ a: 1 }` — it's a prefix of the compound index.
- C. Drop the `_id` index.
- D. Add `{ b: 1 }`.

<details><summary>Answer</summary>

**B.** The `_id` index can't be dropped. *(3.1)*
</details>

**36.** Which statements about index costs are true? *(Choose 2)*
- A. Each index adds work to inserts, updates and deletes.
- B. Indexes use RAM and disk.
- C. More indexes always mean faster writes.
- D. Indexes are free if queries don't use them.

<details><summary>Answer</summary>

**A, B.** *(3.1)*
</details>

**37.** Which field is the best candidate to put first in an index used for frequent equality queries?
- A. `isActive` (true/false)
- B. `country` (5 values)
- C. `email` (unique per user)
- D. `gender` (3 values)

<details><summary>Answer</summary>

**C.** High cardinality = highly selective. *(3.2)*
</details>

**38.** 98% of documents have `status: "done"`. Queries filter by `status: "pending"` (2%). Which statement is true?
- A. An index on `status` doesn't help any query.
- B. An index on `status` helps queries for the rare value "pending" a lot, but helps little for "done".
- C. Indexes ignore value distribution.
- D. You must shard on `status`.

<details><summary>Answer</summary>

**B.** Value distribution decides how selective each lookup is. A partial index on `status: "pending"` could be even smaller. *(3.2)*
</details>

**39.** An index `{ lastName: 1, firstName: 1 }` exists. Which sort can it support without an in-memory sort?
- A. `{ lastName: 1, firstName: -1 }`
- B. `{ lastName: -1, firstName: -1 }`
- C. `{ firstName: 1, lastName: 1 }`
- D. `{ firstName: 1 }`

<details><summary>Answer</summary>

**B.** It's the exact inverse of the index. A mixes directions; C and D don't follow the field order or prefix. *(3.2)*
</details>

**40.** How do you confirm a query uses the expected index `customerId_1`?
- A. Check the cluster's billing page.
- B. Run `.explain("executionStats")` and check for `IXSCAN` with `indexName: "customerId_1"`.
- C. Count the documents in the collection.
- D. Look at the IP Access List.

<details><summary>Answer</summary>

**B.** *(3.3)*
</details>

**41.** explain shows: `IXSCAN` on `status_1`, `totalKeysExamined: 80000`, `totalDocsExamined: 80000`, `nReturned: 20`. The query filters on `status` and `customerId`. What's the best fix?
- A. The query is optimal.
- B. Create a compound index including `customerId` (e.g. `{ customerId: 1, status: 1 }`).
- C. Drop the `status_1` index and rely on a COLLSCAN.
- D. Increase the oplog window.

<details><summary>Answer</summary>

**B.** The index is used but isn't selective enough: 80,000 examined for 20 returned. *(3.3, 3.4)*
</details>

**42.** Which are valid ways to optimize a slow query found with explain? *(Choose 3)*
- A. Create or adjust an index.
- B. Modify the query (add selective filters, projection).
- C. Change the data model (e.g. embed data that is always joined).
- D. Add more IP Access List entries.
- E. Enable Backup Compliance Policy.

<details><summary>Answer</summary>

**A, B, C.** *(3.4)*
</details>

**43.** Which is an example of **vertical** scaling in Atlas?
- A. Adding a shard.
- B. Changing the cluster from M30 to M50.
- C. Adding a read-only node in another region.
- D. Creating a second cluster.

<details><summary>Answer</summary>

**B.** Horizontal scaling = sharding. *(3.4)*
</details>

**44.** You need to create an index on a large, busy production collection and minimize impact. What should you do?
- A. Create it during peak hours with a rolling index build.
- B. Use Atlas's rolling index build (one node at a time) during off-peak hours.
- C. Drop all other indexes first.
- D. Pause the cluster.

<details><summary>Answer</summary>

**B.** *(3.5)*
</details>

### Domain 4 — Sharding

**45.** In a sharded cluster, what does the `mongos` do?
- A. Stores the cluster metadata.
- B. Routes queries to the right shards.
- C. Holds a copy of all data.
- D. Takes backups.

<details><summary>Answer</summary>

**B.** Config servers store the metadata; shards store the data. *(4.1)*
</details>

**46.** A query on a sharded collection does **not** include the shard key. What happens?
- A. It fails.
- B. It's sent to all shards (scatter-gather).
- C. It only checks the primary shard.
- D. The balancer runs.

<details><summary>Answer</summary>

**B.** *(4.1)*
</details>

**47.** An IoT app inserts millions of readings per minute and uses a **ranged** shard key on `{ timestamp: 1 }`. What problem will it have?
- A. Jumbo chunks from low cardinality.
- B. All new inserts go to the shard with the highest range (hot shard).
- C. Queries by timestamp become scatter-gather.
- D. None; it's ideal.

<details><summary>Answer</summary>

**B.** Monotonically increasing key. *(4.2)*
</details>

**48.** For the same app, which shard key distributes writes and still allows targeted queries per device?
- A. `{ timestamp: 1 }`
- B. `{ deviceId: 1, timestamp: 1 }`
- C. `{ status: 1 }`
- D. `{ _id: 1 }` with ObjectIds (ranged)

<details><summary>Answer</summary>

**B.** High cardinality from `deviceId`, writes spread across devices, queries by device are targeted. ObjectId ranged is also monotonic. *(4.2)*
</details>

**49.** Which are characteristics of a good shard key? *(Choose 3)*
- A. High cardinality
- B. Low frequency of any single value
- C. Monotonically increasing
- D. Present in most queries
- E. Boolean

<details><summary>Answer</summary>

**A, B, D.** *(4.2)*
</details>

**50.** The shard key `{ customerId: 1 }` produces jumbo chunks because a few customers have huge amounts of data. What's the least disruptive fix?
- A. `refineCollectionShardKey` to `{ customerId: 1, orderId: 1 }`.
- B. Unshard and drop the collection.
- C. Change the key to `{ country: 1 }`.
- D. Add more indexes.

<details><summary>Answer</summary>

**A.** Adding a suffix field raises cardinality while keeping queries by `customerId` targeted. `reshardCollection` is for changing to a completely different key. *(4.3)*
</details>

### Domain 5 — Performance Monitoring and Tuning

**51.** The **Query Targeting** metric shows a ratio of 5000. What does it indicate?
- A. Queries return 5000 documents each.
- B. Queries scan about 5000 documents for every one returned — likely missing or poor indexes.
- C. 5000 queries per second.
- D. 5000 connections.

<details><summary>Answer</summary>

**B.** *(5.1)*
</details>

**52.** Which metric shows operations per second by type (insert, query, update, delete)?
- A. Opcounters
- B. Disk IOPS
- C. Oplog GB/hour
- D. Connections

<details><summary>Answer</summary>

**A.** *(5.1)*
</details>

**53.** Which metrics are most relevant to query performance? *(Choose 3)*
- A. Query Targeting
- B. Operation Execution Time
- C. Opcounters
- D. Number of Atlas users
- E. Billing cost

<details><summary>Answer</summary>

**A, B, C.** *(5.1)*
</details>

**54.** Users report slowness **right now**. Which tool shows live operations and the slowest current queries, and lets you kill them?
- A. Performance Advisor
- B. Real-Time Performance Panel
- C. Backup page
- D. Activity Feed

<details><summary>Answer</summary>

**B.** *(5.2)*
</details>

**55.** Which tool recommends indexes based on slow queries and flags redundant indexes?
- A. Query Profiler
- B. Performance Advisor
- C. Data Explorer
- D. Real-Time Performance Panel

<details><summary>Answer</summary>

**B.** *(5.2)*
</details>

**56.** You want to see which operations were slow over the past 24 hours on the `orders` collection, with their duration over time. Which tool should you use?
- A. Query Profiler
- B. IP Access List
- C. Cloud Backup
- D. Atlas CLI `accessLists`

<details><summary>Answer</summary>

**A.** *(5.2)*
</details>

**57.** After creating an index suggested by Performance Advisor, how do you verify the improvement? *(Choose 2)*
- A. Check that Query Targeting drops for that workload.
- B. Check Query Profiler / Query Insights for lower latency of that query shape.
- C. Check the number of database users.
- D. Check the snapshot schedule.

<details><summary>Answer</summary>

**A, B.** *(5.2)*
</details>

**58.** You want the on-call team to be paged when replication lag exceeds 60 seconds for 5 minutes. What should you configure?
- A. A project alert with condition "Replication Lag > 60 s", a duration, and a PagerDuty integration as the target.
- B. A Backup Compliance Policy.
- C. An IP Access List entry.
- D. A custom database role.

<details><summary>Answer</summary>

**A.** *(5.3)*
</details>

**59.** Which are components of an effective Atlas monitoring strategy? *(Choose 3)*
- A. Alerts on leading indicators (disk usage, lag, query targeting) before outages.
- B. Routing alerts to the on-call team's channel.
- C. Knowing the cluster's normal baseline.
- D. Alerting on every metric with the lowest possible thresholds.
- E. Sending all alerts to one person's personal email.

<details><summary>Answer</summary>

**A, B, C.** D causes alert fatigue. *(5.3)*
</details>

**60.** Which notification channels can Atlas alerts use? *(Choose 3)*
- A. Email
- B. Slack
- C. PagerDuty
- D. Fax

<details><summary>Answer</summary>

**A, B, C.** *(5.3)*
</details>

**61.** What is the main benefit of profiling?
- A. It encrypts slow queries.
- B. It records details of slow operations (query, plan, docs examined, duration) so you can find and fix them.
- C. It backs up the oplog.
- D. It adds IP addresses automatically.

<details><summary>Answer</summary>

**B.** *(5.4)*
</details>

**62.** Why should you avoid database profiler level 2 on a busy production cluster?
- A. It disables indexes.
- B. It records **every** operation, adding significant overhead.
- C. It only records writes.
- D. It turns off the slow query log.

<details><summary>Answer</summary>

**B.** Level 1 records only operations slower than `slowms` (default 100 ms). *(5.4)*
</details>

**63.** The WiredTiger cache is constantly full, disk reads are rising and queries slow down. The working set has grown beyond RAM. Which actions help? *(Choose 2)*
- A. Scale up to a tier with more RAM.
- B. Reduce the working set (drop unused indexes, use projections, archive old data).
- C. Add IP Access List entries.
- D. Increase snapshot retention.

<details><summary>Answer</summary>

**A, B.** *(5.5)*
</details>

**64.** Disk space used is at 92% and growing. What prevents an outage with the least manual work?
- A. Storage auto-scaling (or increase the disk size).
- B. Drop the `_id` index.
- C. Enable profiler level 2.
- D. Add a read-only node.

<details><summary>Answer</summary>

**A.** *(5.5)*
</details>

### Domain 6 — Security, Networking, and Encryption

**65.** A company requires that data at rest be encrypted with keys it manages in AWS. What should you configure?
- A. TLS 1.2.
- B. Encryption at Rest using Customer Key Management with AWS KMS (project setting), then enable it on the cluster.
- C. A custom database role.
- D. Client IP Access List entries.

<details><summary>Answer</summary>

**B.** It uses the Encrypted Storage Engine with your KMS key. TLS is encryption **in transit**. *(6.1)*
</details>

**66.** A developer at home (IP `198.51.100.7`) needs temporary access to a cluster for 6 hours. What's the best practice?
- A. Add `0.0.0.0/0`.
- B. Add `198.51.100.7` as a **temporary** IP Access List entry that expires.
- C. Share the app server's credentials.
- D. Disable the IP Access List.

<details><summary>Answer</summary>

**B.** Least exposure, automatic cleanup. *(6.2)*
</details>

**67.** What does the entry `10.0.0.0/16` in the IP Access List allow?
- A. Only `10.0.0.16`.
- B. Any address from `10.0.0.0` to `10.0.255.255`.
- C. All IPs on the internet.
- D. Nothing; CIDR isn't supported.

<details><summary>Answer</summary>

**B.** *(6.2)*
</details>

**68.** Which statements about Private Endpoints (e.g. AWS PrivateLink) are true? *(Choose 2)*
- A. Traffic between the app and Atlas stays on the cloud provider's private network.
- B. Connections are one-way: your network connects to Atlas, Atlas can't initiate into yours.
- C. Your VPC and the Atlas VPC must have non-overlapping CIDRs and route both ways.
- D. They require adding `0.0.0.0/0`.

<details><summary>Answer</summary>

**A, B.** C describes **network peering**. *(6.3)*
</details>

**69.** A Project Owner tries to connect to a cluster with mongosh using their Atlas login and it fails. Why?
- A. Project Owners can't connect to clusters.
- B. Atlas users manage Atlas; connecting to data requires a **database user**.
- C. mongosh doesn't support Atlas.
- D. The IP Access List only accepts Atlas users.

<details><summary>Answer</summary>

**B.** *(6.4)*
</details>

**70.** A reporting service must only read the `orders` collection in the `shop` database. Following least privilege, what should you do?
- A. Give it `atlasAdmin`.
- B. Give it `readWriteAnyDatabase`.
- C. Create a custom role with the `find` action on `shop.orders` and assign it to a dedicated database user.
- D. Share the main app's database user.

<details><summary>Answer</summary>

**C.** *(6.5)*
</details>

---

**Score yourself:** ≥ 60/70 (~85%) → likely ready. Then take MongoDB's official Atlas Administrator Practice Questions and review every topic you're unsure of in the Atlas docs.

## 9. Suggested study plan (~2 weeks)

| Days | Focus |
|---|---|
| 1–2 | Domains 1 & 3 — reuse the Developer guide (aggregation, queries, indexes, explain). |
| 3–5 | Domain 2 — create an M10 (or use a trial) cluster: look at replica set topology, take an on-demand snapshot, restore to another cluster, run **Test Primary Failover**, explore backup policy settings. |
| 6–8 | Domain 5 — run unindexed queries on the sample dataset, then explore Metrics, Query Targeting, RTPP, Query Profiler, Performance Advisor; create an alert. |
| 9–10 | Domain 6 — IP Access List (temporary entry), database users, custom role, read about peering vs Private Endpoints and Customer Key Management. |
| 11 | Domain 4 — sharding architecture, shard key criteria, refine/reshard. |
| 12+ | This mock exam + official practice questions; re-read section 7. |

Free official prep: **MongoDB Atlas Administrator Path** (completing it gives a 50% exam discount code, useful for a retake) and **Atlas Administrator Exam Practice Questions** on MongoDB University.
