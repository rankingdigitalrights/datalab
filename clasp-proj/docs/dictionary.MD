# Dictionary / Definitions of Service Classes and ID prefixes

1. Purpose: **Binding** document for ensuring consistend named ranges within an Index set.
2. Scope: 2019 RDR Index / 2019-2020 Pilot

## TOC

+ [Index](#)
+ [Companies](#)
+ [Services](#)

## Index

> TBD\
> i.e. `RDR + YYYY`\
> i.e. indicator abbrevations\
> i.e. research steps abbrevations

## Companies

> **Regex**: `[i|t][A-Z]{2}\d`

**Examples**:

+ `Facebook := iFB1`
+ `Etisalat := tES1`

**Rules**:

1. Prefix: Use **one small letter** for easier filtering of `Company Class` by key string `[a-z]{1}`.
2. Core: Use **two CAPTIAL letters** for `company`.
3. Suffix: Add **one trailing number** (start with 1; increase in case of contingencies such as reclassification of a company). Numbering is **not** supposed to distinguish distinct companies!

> This allows for 26\*26\*9 = 6760 combinations, without risking downgrading a company by adding a lower number (i.e. iXY1 > iXY2)

**Definitions**:

+ Internet Companies
  > i

+ Telecommunication Companies
  > t

## Services

> **Regex**: `[a-z]{2}[A-Z]{2}\d` (maybe use defined array for strict validation, i.e. `[bb|cl|ma]`)

**Rules**:

1. Prefix: Use **two small letters** for easier filtering of `Service Class` by key string `[a-z]{2}`
2. Core: Use **two CAPTIAL letters** for corresponging **`company`** (*not service!*).
3. Suffix: Add **one trailing number** number (start with 1; increase if conflict with same-class service from same company - i.e. two messenging services by FB)

**Defintions**

+ Broadband
  > bb

+ Cloud
  > cl

+ eMail
  > ma

+ Mobile Pre/Postpaid
  > mb

+ Mobile Ecosystems
  > me

+ Messaging & VOIP
  > mv

+ Search Engines
  > se

+ Social Networks & Blogs
  > sn

+ Photo / Video
  > pv
