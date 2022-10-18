import { BigInt, ipfs, json, JSONValue, log } from "@graphprotocol/graph-ts";
import { Achievement, Collection, Owner } from "../generated/schema";
import {
  URI,
  CreateItem,
  TransferSingle,
} from "../generated/templates/Collection/Collection";

export function handleCreateItem(event: CreateItem): void {
  const params = event.params;

  const entity = Collection.load(event.address.toHexString());
  if (!entity) {
    return;
  }

  const achievement = new Achievement(
    event.address.toHexString() + "-" + params._id.toHex()
  );
  achievement.score = params._value;
  achievement.intId = params._id;
  achievement.collection = event.address.toHexString();

  entity.save();
  achievement.save();
}

export function handleURI(event: URI): void {
  const params = event.params;

  const entity = Collection.load(event.address.toHexString());
  if (!entity) {
    return;
  }

  let value = new JSONValue();
  log.info(params.value, []);
  if (!params.value.startsWith("ipfs://")) {
    return;
  }

  let v = params.id.toHexString().replace("0x", "");
  if (v.length < 64) {
    const length = v.length;
    for (let i = 0; i < 64 - length; i++) {
      v = "0" + v;
    }
  }

  const file = ipfs.cat(params.value.replace("ipfs://", "").replace("{id}", v));

  if (!file) {
    log.warning("file not found", []);
    return;
  }

  const res = json.try_fromBytes(file);
  if (res.isOk) {
    value = res.value;
  }

  const info = value.toObject();

  const name = info.get("name");
  const image = info.get("image");
  const tallyUrl = info.get("tallyUrl");

  if (name) {
    log.warning(name.toString(), []);
  } else {
    log.warning("name is null", []);
  }

  const achievement = Achievement.load(
    event.address.toHexString() + "-" + params.id.toHex()
  )!;
  if (name) {
    achievement.name = name.toString();
  } else {
    achievement.name = null;
  }

  if (image) {
    achievement.imageUrl = image.toString();
  } else {
    achievement.imageUrl = null;
  }

  if (tallyUrl) {
    achievement.tallyId = tallyUrl.toString();
  } else {
    achievement.tallyId = null;
  }

  achievement.save();
}

export function handleTransferSingle(event: TransferSingle): void {
  const params = event.params;

  const achievement = Achievement.load(
    event.address.toHexString() + "-" + params.id.toHex()
  )!;

  let owner = Owner.load(params.to.toHexString());
  if (!owner) {
    owner = new Owner(params.to.toHexString());
    owner.achievements = new Array<string>(0);
  }
  const array = owner.achievements;
  array.push(achievement.id);

  owner.achievements = array;
  owner.save();
  achievement.save();
}
