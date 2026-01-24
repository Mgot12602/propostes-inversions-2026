# Configuració de Supabase

## Pas 1: Crear compte i projecte a Supabase

1. Ves a https://supabase.com/
2. Clica "Start your project"
3. Crea un compte (pots utilitzar GitHub)
4. Crea un nou projecte:
   - Nom del projecte: `inversions-2026`
   - Database Password: (guarda-la, la necessitaràs)
   - Region: Europe West (Frankfurt) o el més proper
5. Espera uns 2 minuts mentre es crea el projecte

## Pas 2: Crear la taula

1. Al dashboard de Supabase, ves a "SQL Editor"
2. Clica "New query"
3. Enganxa aquest SQL i executa'l:

```sql
CREATE TABLE investments (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Crear política per permetre lectura pública
CREATE POLICY "Enable read access for all users" ON investments
  FOR SELECT USING (true);

-- Crear política per permetre escriptura pública (només per aquest projecte intern)
CREATE POLICY "Enable insert/update for all users" ON investments
  FOR ALL USING (true);
```

## Pas 3: Obtenir les credencials

1. Ves a "Project Settings" (icona d'engranatge a la barra lateral)
2. Clica "API"
3. Copia:
   - **Project URL** (exemple: `https://xxxxx.supabase.co`)
   - **anon public key** (una clau llarga que comença amb `eyJ...`)

## Pas 4: Configurar a Netlify

1. Ves al dashboard de Netlify: https://app.netlify.com/
2. Selecciona el teu site: `inversionshotelcostabella`
3. Ves a "Site configuration" → "Environment variables"
4. Afegeix aquestes dues variables:
   - **Variable 1:**
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: (enganxa el Project URL de Supabase)
   - **Variable 2:**
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Value: (enganxa l'anon public key de Supabase)
5. Clica "Save"

## Pas 5: Redesplegar

1. Ves a "Deploys" a Netlify
2. Clica "Trigger deploy" → "Deploy site"
3. Espera que es completi el desplegament

## Verificació

Un cop desplegat:
1. Ves a la web: https://inversionshotelcostabella.netlify.app
2. Accedeix al panell d'admin
3. Edita qualsevol inversió i desa els canvis
4. Refresca la pàgina - els canvis haurien de persistir!

## Desenvolupament Local (opcional)

Si vols que funcioni també en local amb Supabase:

1. Crea un fitxer `.env.local` a l'arrel del projecte
2. Afegeix les mateixes variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
3. Reinicia el servidor de desenvolupament

---

**Nota:** Sense aquestes variables configurades, l'aplicació seguirà funcionant però utilitzarà les dades inicials del fitxer TypeScript i no persistirà els canvis.
