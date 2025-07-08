import os
import json
import sys
import re
from typing import Dict
import questionary
from PIL import Image

def update_all_artworks_ts(artwork_id: str, all_artworks_path: str = "./src/app/resources/allArtworks.ts"):
    if os.path.exists(all_artworks_path):
        with open(all_artworks_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = (
            'import type { Artwork } from "@/app/resources/types";\n\n'
            "export const artworks: Artwork[] = [];\n"
        )

    new_import = f'import {artwork_id} from "@/app/resources/artworks/{artwork_id}";\n'

    if new_import not in content:
        import_lines = re.findall(r"import .+;\n", content)
        if import_lines:
            last_import = import_lines[-1]
            idx = content.rfind(last_import) + len(last_import)
            content = content[:idx] + new_import + content[idx:]
        else:
            content = new_import + content

    match = re.search(r"export const artworks: Artwork\[\] = \[(.*?)\];", content, re.DOTALL)
    if match:
        current_list = match.group(1).strip()
        if not re.search(rf"\b{artwork_id}\b", current_list):
            if current_list == "":
                new_list = artwork_id
            else:
                new_list = current_list.rstrip(",") + f", {artwork_id}"
            content = content[:match.start(1)] + "\n  " + new_list + "\n" + content[match.end(1):]
    else:
        content += f"\nexport const artworks: Artwork[] = [{artwork_id}];\n"

    with open(all_artworks_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Updated {all_artworks_path} with artwork '{artwork_id}'.")
    
def extract_ts_enum_values(ts_path: str, type_name: str) -> set:
    with open(ts_path, "r", encoding="utf-8") as f:
        ts_content = f.read()

    # First try multiline unions with `| "..."` format
    pattern_multiline = rf'export\s+type\s+{type_name}\s*=\s*((?:\s*\|\s*"[^"]+"\s*)+);'
    match = re.search(pattern_multiline, ts_content, re.MULTILINE)

    # If not found, try single-line union
    if not match:
        pattern_singleline = rf'export\s+type\s+{type_name}\s*=\s*((?:"[^"]+"\s*\|\s*)*"[^"]+");'
        match = re.search(pattern_singleline, ts_content)

    if not match:
        print(f"Could not extract {type_name} from {ts_path}")
        return set()

    type_values_raw = match.group(1)
    values = re.findall(r'"([^"]+)"', type_values_raw)
    return set(values)

def extract_ts_record_labels(ts_path: str, const_name: str) -> Dict[str, str]:
    with open(ts_path, "r", encoding="utf-8") as f:
        ts_content = f.read()

    # Match the start of the constant definition
    pattern = rf'export\s+const\s+{const_name}\s*:\s*Record<[^>]+>\s*=\s*\{{(.*?)\}};'
    match = re.search(pattern, ts_content, re.DOTALL)

    if not match:
        print(f"Could not extract {const_name} from {ts_path}")
        return {}

    record_body = match.group(1)

    # Extract key-value pairs: key: "value",
    entries = re.findall(r'(\w+)\s*:\s*"([^"]+)"', record_body)
    return dict(entries)

def build_spectral_data(base_path, artwork_id, artwork_metadata, type_codes, class_codes, metadata_labels):
    spectral_images = []

    for entry in os.listdir(base_path):
        spectral_type_path = os.path.join(base_path, entry)
        if not os.path.isdir(spectral_type_path) or entry.lower() not in type_codes:
            continue

        spectral_type = entry.lower()

        if spectral_type in {"hsi", "msi"}:
            for subfolder in os.listdir(spectral_type_path):
                spectral_class_path = os.path.join(spectral_type_path, subfolder)
                if not os.path.isdir(spectral_class_path):
                    continue

                spectral_class = subfolder.lower()
                if spectral_class not in class_codes:
                    continue

                image_files = sorted([
                    f for f in os.listdir(spectral_class_path)
                    if os.path.isfile(os.path.join(spectral_class_path, f))
                ])
                
                relative_path = os.path.join("artworks", artwork_id, spectral_type, spectral_class)
                
                hPix, vPix = get_first_image_dimensions(os.path.join(spectral_class_path))
    
                title =  f"{spectral_type}-{spectral_class}"
                metadata, specification = build_image_metadata_from_labels(title, metadata_labels, hPix, vPix, artwork_metadata)
                
                spectral_images.append({
                    "spectralType": spectral_type,
                    "spectralClass": spectral_class,
                    "specification": specification,
                    "metadata": metadata,
                    "path": f"/{relative_path.replace(os.sep, '/')}",
                    "names": image_files
                })

        elif spectral_type in {"rgb", "mono"}:
            for file in os.listdir(spectral_type_path):
                file_path = os.path.join(spectral_type_path, file)
                if not os.path.isfile(file_path):
                    continue
                
                spectral_class, ext = os.path.splitext(file)
                if ext.lower() not in {".jpeg", ".jpg", ".png", '.tif', '.tiff', ".dzi"}:
                    continue
                
                if spectral_class not in class_codes:
                    continue
                
                relative_path = os.path.join("artworks", artwork_id, spectral_type, file)

                hPix = None
                vPix = None
                if ext.lower() != ".dzi":
                    hPix, vPix = get_image_dimensions(file_path)
                    
                title =  f"{spectral_type}-{spectral_class}"
                metadata, specification = build_image_metadata_from_labels(title, metadata_labels, hPix, vPix, artwork_metadata)
                
                spectral_images.append({
                    "spectralType": spectral_type,
                    "spectralClass": spectral_class,
                    "specification": specification,
                    "metadata": metadata,
                    "source": f"/{relative_path.replace(os.sep, '/')}",
                })
                
    return spectral_images

def prompt_metadata_field(field_name: str, yes_no: bool = False) -> str | None:
    if yes_no:
        selection = questionary.select(
            f"{field_name} (Yes/No):",
            choices=["Yes", "No", "(Skip)"]
        ).ask()

        if selection in ("(Skip)", None):
            return None
        return selection
    else:
        user_input = questionary.text(f"Enter {field_name}:").ask()
        return user_input.strip() if user_input else None
    
def prompt_specification_field(field_name: str, options: dict) -> str:
    selection = questionary.select(
        f"Select the {field_name}:",
        choices=[{"name": label, "value": key} for key, label in options.items()]
    ).ask()
    return selection

def build_artwork_metadata_from_labels(title, labels: Dict[str, str]) -> Dict[str, str]:
    print(f"\n-- Enter {title} metadata (press Enter to skip a field) --")
    metadata = {}
    for key, label in labels.items():
        is_yes_no = key in ["rest", "varn"]
        metadata[key] = prompt_metadata_field(label, yes_no=is_yes_no)
    return metadata

def get_image_resolution(artwork_metadata: dict, image_metadata: dict) -> float | None:
    height = artwork_metadata.get("height")
    vertical_pixels = image_metadata.get("vPix")
    if height is not None and vertical_pixels is not None:
        resolution = float(height) / float(vertical_pixels)
        resolution = round(resolution, 4)
        return str(resolution)
    return None

def get_image_dimensions(image_path: str) -> tuple[int | None, int | None]:
    try:
        with Image.open(image_path) as img:
            return img.width, img.height
    except Exception as e:
        print(f"Warning: Could not read image {image_path}: {e}")
    return None, None

def get_first_image_dimensions(folder_path: str) -> tuple[int | None, int | None]:
    for filename in sorted(os.listdir(folder_path)):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path) and filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.tiff')):
            return get_image_dimensions(file_path)
    return None, None

def build_image_metadata_from_labels(title, labels: Dict[str, str], hPix, vPix, artwork_metadata: dict) -> Dict[str, str]:
    print(f"\n-- Generating {title} metadata (press Enter to skip a field) --")
    specification = None
    if (title == "hsi-vnir"):
         specification  = prompt_specification_field("Capturing System",
                                                     {"rsnPkL": "Resonon Pika L", "spcIQ": "Specim IQ"})
    elif (title == "rgb-pht"):
         specification  = prompt_specification_field("Illumination System",
                                                     {"hlg": "Halogen", "led": "LED"})
    metadata = {}
    
    for key, label in labels.items():
        if key == "hPix" and hPix:
            metadata[key] = str(hPix)
        elif key == "vPix" and vPix:
            metadata[key] = str(vPix)
        elif key == "resl":
            metadata[key] = get_image_resolution(artwork_metadata, metadata)
        else:    
            metadata[key] = prompt_metadata_field(label)
    
    return metadata, specification

def main():
    if len(sys.argv) != 1:
        print("Usage: python build_spectral_file.py")
        sys.exit(1)

    artwork_id = input("Enter Id: ")
    input_folder = os.path.join(".", "public", "artworks", artwork_id)
    ts_types_path = os.path.join(".", "src", "app", "resources", "types.ts")
    ts_labels_path = os.path.join(".", "src", "app", "resources", "labels.ts")

    if not os.path.isdir(input_folder):
        print(f"Invalid folder: {input_folder}")
        sys.exit(1)
    if not os.path.exists(ts_types_path):
        print(f"TypeScript types file not found: {ts_types_path}")
        sys.exit(1)
    if not os.path.exists(ts_types_path):
        print(f"TypeScript labels file not found: {ts_labels_path}")
        sys.exit(1)

    SPECTRAL_TYPE_CODES = extract_ts_enum_values(ts_types_path, "SpectralTypeCode")
    SPECTRAL_CLASS_CODES = extract_ts_enum_values(ts_types_path, "SpectralClassCode")
    ARTWORKS_METADATA_LABELS = extract_ts_record_labels(ts_labels_path, "artworkMetadataLabels")
    IMAGE_METADATA_LABELS = extract_ts_record_labels(ts_labels_path, "imageMetadataLabels")

    artwork_name = input("Enter Name: ")
    
    metadata = build_artwork_metadata_from_labels("Artwork", ARTWORKS_METADATA_LABELS)

    output_data = {
        "id": artwork_id,
        "name": artwork_name,
        "metadata": metadata,
        "spectralImages": build_spectral_data(input_folder, artwork_id, metadata,
                                            SPECTRAL_TYPE_CODES, SPECTRAL_CLASS_CODES, IMAGE_METADATA_LABELS)
    }
    
    output_dir = os.path.join(".", "src", "app", "resources", "artworks")
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, f"{artwork_id}.ts")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write('import { Artwork } from "@/app/resources/types";\n\n')
        f.write(f"const {artwork_id}: Artwork = ")
        f.write(json.dumps(output_data, indent=2))
        f.write(";\n\n")
        f.write(f"export default {artwork_id};\n")

    print(f"File saved to {output_path}")
    
    update_all_artworks_ts(artwork_id)

if __name__ == "__main__":
    main()
