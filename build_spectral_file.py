import os
import json
import sys
import re

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

def build_spectral_data(base_path, artwork_id, type_codes, class_codes):
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

                spectral_images.append({
                    "spectralType": spectral_type,
                    "spectralClass": spectral_class,
                    "path": f"/{relative_path.replace(os.sep, '/')}",
                    "names": image_files
                })

        elif spectral_type in {"rgb", "mono"}:
            for file in os.listdir(spectral_type_path):
                file_path = os.path.join(spectral_type_path, file)
                if not os.path.isfile(file_path):
                    continue
                
                spectral_class, ext = os.path.splitext(file)
                if ext.lower() not in {".jpeg", ".jpg", ".png", ".dzi"}:
                    continue
                
                if spectral_class not in class_codes:
                    continue
                
                relative_path = os.path.join("artworks", artwork_id, spectral_type, file)
                # web_path = f"/artworks/{artwork_id}/rgb/{file}"

                spectral_images.append({
                    "spectralType": spectral_type,
                    "spectralClass": spectral_class,
                    "source": f"/{relative_path.replace(os.sep, '/')}",
                })

    return spectral_images

def main():
    if len(sys.argv) != 3:
        print("Usage: python build_spectral_file.py <id> <name>")
        sys.exit(1)

    artwork_id = sys.argv[1]
    artwork_name = sys.argv[2]
    input_folder = os.path.join(".", "public", "artworks", artwork_id)
    ts_path = os.path.join(".", "src", "app", "resources", "types.ts")

    if not os.path.isdir(input_folder):
        print(f"Invalid folder: {input_folder}")
        sys.exit(1)
    if not os.path.exists(ts_path):
        print(f"TypeScript file not found: {ts_path}")
        sys.exit(1)

    SPECTRAL_TYPE_CODES = extract_ts_enum_values(ts_path, "SpectralTypeCode")
    SPECTRAL_class_CODES = extract_ts_enum_values(ts_path, "SpectralClassCode")

    output_data = {
        "id": artwork_id,
        "name": artwork_name,
        "spectralImages": build_spectral_data(input_folder, artwork_id, SPECTRAL_TYPE_CODES, SPECTRAL_class_CODES)
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
