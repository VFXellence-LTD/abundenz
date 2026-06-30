import type { Db } from "../db.js";

export interface PlatformAccount {
  id: number;
  brandId: string | null;
  platform: string;
  handle: string;
  email: string;
  trackingId: string | null;
  status: string;
  notes: string | null;
  url: string | null;
  maxAccounts: string | null;
  active: boolean;
  rotationOrder: number;
  lastPostedAt: string | null;
  staggerHours: number;
  credentialRef: string | null;
}
export type NewPlatformAccount = Omit<PlatformAccount, "id">;

export interface AccountFilter {
  brandId?: string | null;
}

interface Row {
  id: number;
  brand_id: string | null;
  platform: string;
  handle: string;
  email: string;
  tracking_id: string | null;
  status: string;
  notes: string | null;
  url: string | null;
  max_accounts: string | null;
  active: number;
  rotation_order: number;
  last_posted_at: string | null;
  stagger_hours: number;
  credential_ref: string | null;
}

function rowToAccount(r: Row): PlatformAccount {
  return {
    id: r.id,
    brandId: r.brand_id,
    platform: r.platform,
    handle: r.handle,
    email: r.email,
    trackingId: r.tracking_id,
    status: r.status,
    notes: r.notes,
    url: r.url,
    maxAccounts: r.max_accounts,
    active: r.active === 1,
    rotationOrder: r.rotation_order,
    lastPostedAt: r.last_posted_at,
    staggerHours: r.stagger_hours,
    credentialRef: r.credential_ref,
  };
}

export class PlatformAccountsService {
  constructor(private db: Db) {}

  list(filter?: AccountFilter): PlatformAccount[] {
    let sql = "SELECT * FROM platform_accounts";
    const params: unknown[] = [];
    if (filter && "brandId" in filter) {
      if (filter.brandId === null) {
        sql += " WHERE brand_id IS NULL";
      } else if (filter.brandId !== undefined) {
        sql += " WHERE brand_id = ?";
        params.push(filter.brandId);
      }
    }
    sql += " ORDER BY rotation_order ASC, id ASC";
    const rows = this.db.raw.prepare(sql).all(...params) as Row[];
    return rows.map(rowToAccount);
  }

  get(id: number): PlatformAccount | undefined {
    const r = this.db.raw.prepare("SELECT * FROM platform_accounts WHERE id=?").get(id) as Row | undefined;
    return r ? rowToAccount(r) : undefined;
  }

  create(data: NewPlatformAccount): PlatformAccount {
    const info = this.db.raw
      .prepare(
        `INSERT INTO platform_accounts
          (brand_id, platform, handle, email, tracking_id, status, notes, url, max_accounts,
           active, rotation_order, last_posted_at, stagger_hours, credential_ref)
         VALUES
          (@brand_id, @platform, @handle, @email, @tracking_id, @status, @notes, @url, @max_accounts,
           @active, @rotation_order, @last_posted_at, @stagger_hours, @credential_ref)`
      )
      .run({
        brand_id: data.brandId ?? null,
        platform: data.platform,
        handle: data.handle ?? "",
        email: data.email ?? "",
        tracking_id: data.trackingId ?? null,
        status: data.status ?? "not-started",
        notes: data.notes ?? null,
        url: data.url ?? null,
        max_accounts: data.maxAccounts ?? null,
        active: data.active ? 1 : 0,
        rotation_order: data.rotationOrder ?? 0,
        last_posted_at: data.lastPostedAt ?? null,
        stagger_hours: data.staggerHours ?? 4.0,
        credential_ref: data.credentialRef ?? null,
      });
    return this.get(Number(info.lastInsertRowid))!;
  }

  update(id: number, patch: Partial<NewPlatformAccount>): PlatformAccount | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare(
        `UPDATE platform_accounts SET
          brand_id=@brand_id, platform=@platform, handle=@handle, email=@email,
          tracking_id=@tracking_id, status=@status, notes=@notes, url=@url,
          max_accounts=@max_accounts, active=@active, rotation_order=@rotation_order,
          last_posted_at=@last_posted_at, stagger_hours=@stagger_hours, credential_ref=@credential_ref
         WHERE id=@id`
      )
      .run({
        id,
        brand_id: merged.brandId ?? null,
        platform: merged.platform,
        handle: merged.handle,
        email: merged.email,
        tracking_id: merged.trackingId ?? null,
        status: merged.status,
        notes: merged.notes ?? null,
        url: merged.url ?? null,
        max_accounts: merged.maxAccounts ?? null,
        active: merged.active ? 1 : 0,
        rotation_order: merged.rotationOrder,
        last_posted_at: merged.lastPostedAt ?? null,
        stagger_hours: merged.staggerHours,
        credential_ref: merged.credentialRef ?? null,
      });
    return this.get(id);
  }

  remove(id: number): boolean {
    const info = this.db.raw.prepare("DELETE FROM platform_accounts WHERE id=?").run(id);
    return info.changes > 0;
  }
}
