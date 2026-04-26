export interface GenerateXFollowerProofRequest {
  username: string;
  levelId: string;
}

export interface GenerateXFollowerProofResponse {
  group_id: string;
  level_id: string;
  username: string;
  threshold: number;
  followers_count: number;
  proof: {
    verifying_key_hex: string;
    proof_hex: string;
    public_inputs_hex: string;
  };
}

const PROVER_API_BASE_URL =
  import.meta.env.VITE_PROVER_API_URL ?? "http://127.0.0.1:8080";

export async function generateXFollowerCountProof(
  payload: GenerateXFollowerProofRequest,
): Promise<GenerateXFollowerProofResponse> {
  const response = await fetch(
    `${PROVER_API_BASE_URL}/proof-groups/x_follower_count/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        level_id: payload.levelId,
      }),
    },
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Prover API failed with status ${response.status}`);
  }

  return JSON.parse(text) as GenerateXFollowerProofResponse;
}

export interface GenerateInstagramFollowerProofRequest {
  username: string;
  levelId: string;
}

export type GenerateInstagramFollowerProofResponse =
  GenerateXFollowerProofResponse;

export async function generateInstagramFollowerCountProof(
  payload: GenerateInstagramFollowerProofRequest,
): Promise<GenerateInstagramFollowerProofResponse> {
  const response = await fetch(
    `${PROVER_API_BASE_URL}/proof-groups/instagram_follower_count/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        level_id: payload.levelId,
      }),
    },
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Prover API failed with status ${response.status}`);
  }

  return JSON.parse(text) as GenerateInstagramFollowerProofResponse;
}

export interface GenerateXAccountAgeProofRequest {
  username: string;
  levelId: string;
}

export interface GenerateXAccountAgeProofResponse {
  group_id: string;
  level_id: string;
  username: string;
  min_age_months: number;
  account_age_months: number;
  proof: {
    verifying_key_hex: string;
    proof_hex: string;
    public_inputs_hex: string;
  };
}

export async function generateXAccountAgeProof(
  payload: GenerateXAccountAgeProofRequest,
): Promise<GenerateXAccountAgeProofResponse> {
  const response = await fetch(
    `${PROVER_API_BASE_URL}/proof-groups/x_account_age/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        level_id: payload.levelId,
      }),
    },
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Prover API failed with status ${response.status}`);
  }

  return JSON.parse(text) as GenerateXAccountAgeProofResponse;
}
