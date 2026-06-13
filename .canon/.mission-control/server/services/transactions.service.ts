import type { Db } from "../db.js";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  ecosystemId: string;
  stream: string;
  vertical?: string;
  band?: string;
  listingId?: string;
  description: string;
  type: "income" | "expense";
}
export type NewTransaction = Omit<Transaction, "id">;

interface Row {
  id: string;
  date: string;
  amount: number;
  ecosystem_id: string;
  stream: string;
  vertical: string | null;
  band: string | null;
  listing_id: string | null;
  description: string;
  type: string;
}

function rowToTransaction(r: Row): Transaction {
  return {
    id: r.id,
    date: r.date,
    amount: r.amount,
    ecosystemId: r.ecosystem_id,
    stream: r.stream,
    vertical: r.vertical ?? undefined,
    band: r.band ?? undefined,
    listingId: r.listing_id ?? undefined,
    description: r.description,
    type: r.type as Transaction["type"],
  };
}

function genId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class TransactionsService {
  constructor(private db: Db) {}

  list(): Transaction[] {
    const rows = this.db.raw
      .prepare("SELECT * FROM transactions ORDER BY rowid DESC")
      .all() as Row[];
    return rows.map(rowToTransaction);
  }

  get(id: string): Transaction | undefined {
    const r = this.db.raw.prepare("SELECT * FROM transactions WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTransaction(r) : undefined;
  }

  create(data: NewTransaction): Transaction {
    const id = genId();
    this.db.raw
      .prepare(
        `INSERT INTO transactions (id,date,amount,ecosystem_id,stream,vertical,band,listing_id,description,type)
         VALUES (@id,@date,@amount,@ecosystem_id,@stream,@vertical,@band,@listing_id,@description,@type)`,
      )
      .run({
        id,
        date: data.date,
        amount: data.amount,
        ecosystem_id: data.ecosystemId,
        stream: data.stream,
        vertical: data.vertical ?? null,
        band: data.band ?? null,
        listing_id: data.listingId ?? null,
        description: data.description,
        type: data.type,
      });
    return this.get(id)!;
  }

  importMany(items: NewTransaction[]): Transaction[] {
    const tx = this.db.raw.transaction((rows: NewTransaction[]) =>
      rows.map((row) => this.create(row)),
    );
    return tx(items);
  }

  update(id: string, patch: Partial<NewTransaction>): Transaction | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare(
        `UPDATE transactions SET date=@date, amount=@amount, ecosystem_id=@ecosystem_id,
           stream=@stream, vertical=@vertical, band=@band, listing_id=@listing_id,
           description=@description, type=@type WHERE id=@id`,
      )
      .run({
        id,
        date: merged.date,
        amount: merged.amount,
        ecosystem_id: merged.ecosystemId,
        stream: merged.stream,
        vertical: merged.vertical ?? null,
        band: merged.band ?? null,
        listing_id: merged.listingId ?? null,
        description: merged.description,
        type: merged.type,
      });
    return this.get(id);
  }

  remove(id: string): boolean {
    const info = this.db.raw.prepare("DELETE FROM transactions WHERE id=?").run(id);
    return info.changes > 0;
  }
}
