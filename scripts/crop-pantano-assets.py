from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "items"


def crop_icon(source: Path, box: tuple[int, int, int, int], target: str) -> None:
    image = Image.open(source).convert("RGBA").crop(box)
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            # As pranchas foram geradas sobre branco/off-white. Removemos só o
            # fundo próximo do branco e preservamos contornos claros do item.
            if r >= 238 and g >= 232 and b >= 220:
                pixels[x, y] = (r, g, b, 0)
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    side = max(image.width, image.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(image, ((side - image.width) // 2, (side - image.height) // 2))
    canvas = canvas.resize((256, 256), Image.Resampling.NEAREST)
    destination = OUT / target
    canvas.save(destination, "PNG", optimize=True)
    print(f"created {target}")


def grid(source_name: str, names: list[str], columns: int, rows: int) -> None:
    source = ROOT / "imagens" / "pantano" / source_name
    if not source.exists():
        raise SystemExit(f"missing source: {source}")
    with Image.open(source) as image:
        cell_w = image.width // columns
        cell_h = image.height // rows
    for index, name in enumerate(names):
        row, column = divmod(index, columns)
        crop_icon(source, (column * cell_w, row * cell_h, (column + 1) * cell_w, (row + 1) * cell_h), name)


grid(
    "PANTANO_VEYRA_EQUIPAMENTOS_SHEET.png",
    [
        "CAPUZ_MIASMA_T3.png", "MANTO_MEMORIA_T3.png", "LUVAS_LAMINA_T3.png", "BOTAS_SILTE_T3.png",
        "PULSEIRA_VEYRA_T3.png", "ARCO_LIBELULA_T3.png", "ESCUDO_CARAPACA_VEYRA_T3.png", "COLAR_RAIZ_MEMORIA_T3.png",
    ],
    columns=4,
    rows=2,
)

grid(
    "PANTANO_VEYRA_MATRIZES_SHEET.png",
    [
        "A16.png", "A17.png", "A18.png", "A19.png",
        "A20.png", "S14.png", "S15.png", "S16.png",
        "S17.png", "S18.png", "P13.png", "P14.png",
    ],
    columns=4,
    rows=4,
)

grid(
    "PANTANO_VEYRA_LOOT_SHEET.png",
    ["RESINA_MIASMA.png", "ASA_LAMINA.png", "NO_MEMORIA.png", "DENTE_SILTE.png", "COROA_LODO.png"],
    columns=5,
    rows=2,
)

