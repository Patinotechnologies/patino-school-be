import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("schools", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("organization_id")
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.enu("level", ["nursery", "primary", "secondary"], {
      useNative: true,
      enumName: "school_level",
    }).notNullable();
    // Set once the onboarding wizard (staff count, grades, terms) is completed; the
    // school isn't considered active, and shouldn't appear in sidebar switchers, until then.
    table.timestamp("onboarded_at").nullable();
    table.timestamps(true, true);

    table.index("organization_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("schools");
  await knex.raw('DROP TYPE IF EXISTS "school_level"');
}
