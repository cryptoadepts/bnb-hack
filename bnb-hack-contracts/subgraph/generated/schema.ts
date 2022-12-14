// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Collection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Collection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Collection must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Collection", id.toString(), this);
    }
  }

  static load(id: string): Collection | null {
    return changetype<Collection | null>(store.get("Collection", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value!.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get token(): Bytes {
    let value = this.get("token");
    return value!.toBytes();
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }

  get achievements(): Array<string> {
    let value = this.get("achievements");
    return value!.toStringArray();
  }

  set achievements(value: Array<string>) {
    this.set("achievements", Value.fromStringArray(value));
  }
}

export class Achievement extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Achievement entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Achievement must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Achievement", id.toString(), this);
    }
  }

  static load(id: string): Achievement | null {
    return changetype<Achievement | null>(store.get("Achievement", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get intId(): BigInt {
    let value = this.get("intId");
    return value!.toBigInt();
  }

  set intId(value: BigInt) {
    this.set("intId", Value.fromBigInt(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get imageUrl(): string | null {
    let value = this.get("imageUrl");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set imageUrl(value: string | null) {
    if (!value) {
      this.unset("imageUrl");
    } else {
      this.set("imageUrl", Value.fromString(<string>value));
    }
  }

  get tallyId(): string | null {
    let value = this.get("tallyId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tallyId(value: string | null) {
    if (!value) {
      this.unset("tallyId");
    } else {
      this.set("tallyId", Value.fromString(<string>value));
    }
  }

  get score(): BigInt {
    let value = this.get("score");
    return value!.toBigInt();
  }

  set score(value: BigInt) {
    this.set("score", Value.fromBigInt(value));
  }

  get owners(): Array<string> {
    let value = this.get("owners");
    return value!.toStringArray();
  }

  set owners(value: Array<string>) {
    this.set("owners", Value.fromStringArray(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }
}

export class Owner extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Owner entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Owner must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Owner", id.toString(), this);
    }
  }

  static load(id: string): Owner | null {
    return changetype<Owner | null>(store.get("Owner", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get achievements(): Array<string> {
    let value = this.get("achievements");
    return value!.toStringArray();
  }

  set achievements(value: Array<string>) {
    this.set("achievements", Value.fromStringArray(value));
  }
}
