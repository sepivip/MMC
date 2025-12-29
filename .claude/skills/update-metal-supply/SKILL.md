---
name: update-metal-supply
description: Researches and updates metal supply, demand, and production data from authoritative sources like USGS. Use when asked to update metal supply data, research metal production, fix supply values, or get real supply numbers for metals.
---

# Update Metal Supply Data Skill

## Overview

This skill researches current metal supply, demand, and production data from authoritative sources and updates the `src/data/mockMetals.ts` file with accurate real-world values.

## When to Use

Use this skill when the user asks to:
- "Update metal supply data"
- "Research metal supply"
- "Fix supply values"
- "Get real supply numbers"

## Data Sources

Search these authoritative sources for accurate data:

| Source | URL | Data Types |
|--------|-----|------------|
| USGS Mineral Commodity Summaries | usgs.gov/centers/national-minerals-information-center | Production, reserves, supply |
| World Gold Council | gold.org | Gold supply, demand |
| Silver Institute | silverinstitute.org | Silver production, demand |
| International Copper Study Group | icsg.org | Copper statistics |
| International Aluminium Institute | international-aluminium.org | Aluminum production |
| Cobalt Institute | cobaltinstitute.org | Cobalt supply chain |

## Metals to Research

Research data for all 12 metals in the system:

### Precious Metals
| ID | Name | Symbol | Key Metrics |
|----|------|--------|-------------|
| gold | Gold | XAU | Above-ground stock ~210,000 tons, mine production ~3,500 tons/year |
| silver | Silver | XAG | Above-ground stock ~1.7M tons, mine production ~26,000 tons/year |
| platinum | Platinum | XPT | Above-ground stock ~8,000 tons, mine production ~180 tons/year |
| palladium | Palladium | XPD | Above-ground stock ~7,000 tons, mine production ~210 tons/year |

### Industrial Metals
| ID | Name | Symbol | Key Metrics |
|----|------|--------|-------------|
| copper | Copper | HG | Global reserves ~880M tons, mine production ~22M tons/year |
| aluminum | Aluminum | ALU | Global stock ~1.2B tons, production ~68M tons/year |
| zinc | Zinc | ZN | Global reserves ~250M tons, mine production ~13M tons/year |
| lead | Lead | PB | Global reserves ~90M tons, mine production ~4.5M tons/year |
| tin | Tin | SN | Global reserves ~4.9M tons, mine production ~300K tons/year |

### Battery Metals
| ID | Name | Symbol | Key Metrics |
|----|------|--------|-------------|
| lithium | Lithium | Li | Global reserves ~26M tons, mine production ~130K tons/year |
| nickel | Nickel | NI | Global reserves ~100M tons, mine production ~3.3M tons/year |
| cobalt | Cobalt | Co | Global reserves ~8M tons, mine production ~190K tons/year |

## Research Process

### Step 1: Search for Current Data
For each metal, search the web for:
```
"[metal name] global production 2024 USGS"
"[metal name] world reserves tons"
"[metal name] annual demand statistics"
```

### Step 2: Extract Key Values
For each metal, find:
- **supply**: Total global reserves or above-ground stock (in metric tons)
- **demand**: Annual global demand/consumption (in metric tons per year)
- **production**: Annual mine/refinery production (in metric tons per year)

### Step 3: Update mockMetals.ts
Edit the file at `src/data/mockMetals.ts` and update each metal's values:

```typescript
{
  id: 'gold',
  // ... other fields ...
  supply: 210000,      // Total above-ground stock in tons
  demand: 4500,        // Annual demand in tons
  production: 3500,    // Annual mine production in tons
}
```

## Validation Rules

Ensure values are within realistic ranges:

| Metal | Supply (tons) | Production (tons/year) |
|-------|---------------|------------------------|
| Gold | 200,000 - 220,000 | 3,000 - 4,000 |
| Silver | 1,500,000 - 2,000,000 | 24,000 - 28,000 |
| Platinum | 7,000 - 10,000 | 170 - 200 |
| Palladium | 6,000 - 8,000 | 200 - 220 |
| Copper | 800,000,000 - 900,000,000 | 20,000,000 - 25,000,000 |
| Aluminum | 1,000,000,000 - 1,500,000,000 | 65,000,000 - 70,000,000 |
| Zinc | 200,000,000 - 300,000,000 | 12,000,000 - 14,000,000 |
| Lead | 80,000,000 - 100,000,000 | 4,000,000 - 5,000,000 |
| Tin | 4,000,000 - 6,000,000 | 280,000 - 350,000 |
| Lithium | 20,000,000 - 30,000,000 | 100,000 - 150,000 |
| Nickel | 90,000,000 - 110,000,000 | 3,000,000 - 3,500,000 |
| Cobalt | 7,000,000 - 10,000,000 | 170,000 - 220,000 |

## File to Update

**Path:** `src/data/mockMetals.ts`

The file contains an array called `mockMetals` with 12 metal objects. Update the `supply`, `demand`, and `production` fields for each metal.

**Important:** Do NOT modify:
- The `generateSparkline` function at the top of the file
- Other fields like `id`, `name`, `symbol`, `category`, `price`, `priceUnit`
- The `mockNews` array at the bottom

## Example Usage

User: "Update the metal supply data with real values"

Claude will:
1. Search web for current USGS mineral commodity data
2. Extract supply, demand, production values for each metal
3. Edit mockMetals.ts with the researched values
4. Report what was updated

## Notes

- Supply values should represent total global reserves or above-ground stock
- All values are in metric tons
- Production and demand are annual figures
- Market cap will be calculated dynamically from supply × price in the API
