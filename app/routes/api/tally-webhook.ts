import { useQuery } from "@apollo/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { BigNumber, ethers } from "ethers";
import gql from "graphql-tag";
import graphqlClient from "~/graphql/client";
import { mint } from "~/models/transaction.server";
// import crypto from "crypto";

// {
//   "eventId": "0a5aca8a-8115-4e69-a550-731801f3e2b4",
//   "eventType": "FORM_RESPONSE",
//   "createdAt": "2022-09-10T10:45:47.311Z",
//   "data": {
//   "responseId": "obZvGx",
//     "submissionId": "obZvGx",
//     "respondentId": "vGr94g",
//     "formId": "3xXEWo",
//     "formName": "Online Trivia Quiz",
//     "createdAt": "2022-09-10T10:45:47.000Z",
//     "fields": [
//     {
//       "key": "question_npPGdJ",
//       "label": "What is the capital of Bulgaria?",
//       "type": "MULTIPLE_CHOICE",
//       "value": "d89dba67-bb2e-45cb-9ab4-61fcaf3f773f",
//       "options": [
//         {
//           "id": "d89dba67-bb2e-45cb-9ab4-61fcaf3f773f",
//           "text": "Sofia"
//         },
//         {
//           "id": "3c7f42e7-31f0-4f09-a03b-d9ac50451a1e",
//           "text": "Plovdiv"
//         },
//         {
//           "id": "15a1aa9b-420f-4245-a395-b646f1efe6c8",
//           "text": "Varna"
//         }
//       ]
//     },
//     {
//       "key": "question_312Mkp_2b2d44c3-c242-47df-b59c-83e0ff4eff20",
//       "label": "Score",
//       "type": "CALCULATED_FIELDS",
//       "value": 20
//     },
//     {
//       "key": "question_wMdLDM",
//       "label": "What is the most famous dish in Belgium?",
//       "type": "MULTIPLE_CHOICE",
//       "value": "8acc4f4d-ee0d-404e-b16e-6cccad712728",
//       "options": [
//         {
//           "id": "694dbc45-fbaa-4fec-a5be-b702008cf928",
//           "text": "Spaghetti"
//         },
//         {
//           "id": "d702510c-9cf1-49af-9899-b6cfbead9689",
//           "text": "Steak with fries"
//         },
//         {
//           "id": "8acc4f4d-ee0d-404e-b16e-6cccad712728",
//           "text": "Waffles"
//         }
//       ]
//     },
//     {
//       "key": "question_mJkLdo",
//       "label": "What is the name of this actor?",
//       "type": "INPUT_TEXT",
//       "value": "George "
//     }
//   ]
// }
// }

interface AchievementQueryResponse {
  achievements: Achievement[];
}
interface Achievement {
  intId: BigInt;
  collection: Collection;
  owners: Array<Owner>;
}

interface Collection {
  id: String;
}

interface Owner {
  id: String;
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();
  console.log("payload", payload);

  let address = "";
  let email = "";
  let success = false;
  for (const field of payload.data.fields) {
    if (field.label === "address") {
      address = field.value;
    }

    if (field.label === "email") {
      email = field.value;
    }

    if (field.label === "success") {
      success = field.value.toString() == "1";
    }
  }

  console.log("address", address);
  console.log("email", email);
  console.log("success", success);

  if (!ethers.utils.isAddress(address) || !success) {
    return json({ success: true }, 200);
  }

  const formId = payload.data.formId;
  console.log(formId.toString());
  const res = await graphqlClient.query<AchievementQueryResponse>({
    query: gql`
      query GetAch($tallyId: String!) {
        achievements(where: { tallyId: $tallyId }) {
          intId
          collection {
            id
          }
          owners {
            id
          }
        }
      }
    `,
    variables: { tallyId: formId },
  });

  console.log(res.data);

  if (!res.data || res.data.achievements.length !== 0) {
    let collectionId = res.data?.achievements[0].collection!.id.toString();
    let achievementId = BigNumber.from(res.data?.achievements[0].intId);

    const owner = res.data?.achievements[0].owners.find((x) => x.id == address);
    if (collectionId && achievementId && !owner) {
      const tx = await mint({ collectionId, receiver: address, achievementId });
      console.log(tx.hash);
      await tx.wait(1); //TODO: test tally timeout
    }
  }

  /* Validate the webhook */
  // const signature = request.headers.get("X-Hub-Signature-256");
  // const generatedSignature = `sha256=${crypto
  //   .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET || "")
  //   .update(JSON.stringify(payload))
  //   .digest("hex")}`;
  // if (signature !== generatedSignature) {
  //   return json({ message: "Signature mismatch" }, 401);
  // }

  /* process the webhook (e.g. enqueue a background job) */

  return json({ success: true }, 200);
};
