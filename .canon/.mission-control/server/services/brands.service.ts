import type { Db } from "../db.js";

export interface Brand {
  id: string;
  name: string;
  ecosystemId: string;
  email: string;
}
export type NewBrand = Omit<Brand, "id"> & { id?: string };

interface Row {
  id: string;
  name: string;
  ecosystem_id: string;
  email: string;
}

function rowToBrand(r: Row): Brand {
  return { id: r.id, name: r.name, ecosystemId: r.ecosystem_id, email: r.email };
}

function genId(): string {
  return `brn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class BrandsService {
  constructor(private db: Db) {}

  list(): Brand[] {
    const rows = this.db.raw.prepare("SELECT * FROM brands ORDER BY rowid DESC").all() as Row[];
    return rows.map(rowToBrand);
  }

  get(id: string): Brand | undefined {
    const r = this.db.raw.prepare("SELECT * FROM brands WHERE id=?").get(id) as Row | undefined;
    return r ? rowToBrand(r) : undefined;
  }

  create(data: NewBrand): Brand {
    const id = data.id ?? genId();
    this.db.raw
      .prepare("INSERT INTO brands (id, name, ecosystem_id, email) VALUES (@id, @name, @ecosystem_id, @email)")
      .run({ id, name: data.name, ecosystem_id: data.ecosystemId, email: data.email ?? "" });
    return this.get(id)!;
  }

  update(id: string, patch: Partial<NewBrand>): Brand | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare("UPDATE brands SET name=@name, ecosystem_id=@ecosystem_id, email=@email WHERE id=@id")
      .run({ id, name: merged.name, ecosystem_id: merged.ecosystemId, email: merged.email });
    return this.get(id);
  }

  remove(id: string): boolean {
    const info = this.db.raw.prepare("DELETE FROM brands WHERE id=?").run(id);
    return info.changes > 0;
  }
}
