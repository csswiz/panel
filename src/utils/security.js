// Cryptographic Hash-based Credential Authentication Service
// Uses browser SubtleCrypto (SHA-256) with custom salt to securely authenticate without storing raw text.

const AUTH_SALT = "smm_panel_secure_salt_2026_";

/**
 * Computes a salted SHA-256 hash for any input string.
 * @param {string} str - Raw input string (username/password)
 * @returns {Promise<string>} Hexadecimal SHA-256 hash string
 */
export async function hashCredential(str) {
  if (!str) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(AUTH_SALT + str.trim().toLowerCase());
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed salted SHA-256 hashes for authorized admin identifiers
const ADMIN_IDENTIFIER_HASHES = [
  "3b8d3c21f31b566ee6ba7550c06f086661ead218813abacf9bbd6f2bb8d83933", // Hashed username
  "f4bfb74e309b74189bcfa4d06cc8a658f916a262b0187f0c952cf2497dd6cab1"  // Hashed admin email
];

// Pre-computed salted SHA-256 hash for admin authorization password
const ADMIN_PASSWORD_HASH = "3e2a637c4ee762ede8414bb61a6972e801b0aadbc74c0630191e2cebe9c7c972";

/**
 * Verifies if the provided username/email and password match administrator hashes.
 * @param {string} identifier - Username or Email
 * @param {string} password - Raw password
 * @returns {Promise<boolean>} True if matching admin hashes
 */
export async function verifyAdminCredentials(identifier, password) {
  if (!identifier || !password) return false;
  
  try {
    const idHash = await hashCredential(identifier);
    const passHash = await hashCredential(password);
    
    const isValidId = ADMIN_IDENTIFIER_HASHES.includes(idHash);
    const isValidPass = passHash === ADMIN_PASSWORD_HASH;
    
    return isValidId && isValidPass;
  } catch (error) {
    console.error("Authentication security error:", error);
    return false;
  }
}
