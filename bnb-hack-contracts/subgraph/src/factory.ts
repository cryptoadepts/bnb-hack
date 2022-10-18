import { BigInt, ipfs } from "@graphprotocol/graph-ts";
import {
  Factory,
  CreateCollection,
  OwnershipTransferred,
} from "../generated/Factory/Factory";
import { Collection, Achievement } from "../generated/schema";
import * as templates from "../generated/templates";

export function handleCreateCollection(event: CreateCollection): void {
  const params = event.params;

  const id = params.collection.toHexString();
  const entity = new Collection(id);

  entity.owner = params.owner;
  entity.token = params.token;

  entity.save();

  templates.Collection.create(params.collection);
}
