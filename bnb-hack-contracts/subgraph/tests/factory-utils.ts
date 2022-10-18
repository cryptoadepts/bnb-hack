import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  CreateCollection,
  OwnershipTransferred
} from "../generated/Factory/Factory"

export function createCreateCollectionEvent(
  collection: Address,
  itemsContract: Address,
  token: Address,
  owner: Address
): CreateCollection {
  let createCollectionEvent = changetype<CreateCollection>(newMockEvent())

  createCollectionEvent.parameters = new Array()

  createCollectionEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )
  createCollectionEvent.parameters.push(
    new ethereum.EventParam(
      "itemsContract",
      ethereum.Value.fromAddress(itemsContract)
    )
  )
  createCollectionEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  createCollectionEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return createCollectionEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
