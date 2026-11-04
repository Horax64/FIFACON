declare namespace Cloudflare {
  interface Env {
    EDITOR_EMAILS?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
