CREATE TABLE "pokemon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"pokedex_number" integer NOT NULL,
	"types" jsonb NOT NULL,
	"sprites" jsonb NOT NULL,
	"stats" jsonb NOT NULL,
	"abilities" jsonb,
	"height" integer,
	"weight" integer,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pokemon_pokedex_number_unique" UNIQUE("pokedex_number")
);
--> statement-breakpoint
CREATE TABLE "user_pokemon" (
	"user_id" integer NOT NULL,
	"pokemon_id" integer NOT NULL,
	"caught_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_pokemon_user_id_pokemon_id_pk" PRIMARY KEY("user_id","pokemon_id")
);
--> statement-breakpoint
ALTER TABLE "user_pokemon" ADD CONSTRAINT "user_pokemon_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pokemon" ADD CONSTRAINT "user_pokemon_pokemon_id_pokemon_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemon"("id") ON DELETE cascade ON UPDATE no action;