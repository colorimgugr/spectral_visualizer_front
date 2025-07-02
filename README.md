# Spectral Visualizer

Welcome to **Spectral Visualizer** — a web-based app to explore multispectral and hyperspectral images using deep zoom technology.  
You can see it live at [spectral-visualizer.vercel.app](https://spectral-visualizer.vercel.app/).

---

## 🧰 Part 1: Project Setup & Installation

### 🔧 Technologies Used
This project was built with:

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Once UI](https://docs.once-ui.com/once-ui/quick-start)
- [Vercel](https://vercel.com/) (for deployment)
- [OpenSeaDragon](https://openseadragon.github.io/) (for deep zoom image viewing)

### 📦 How to install the project

1. **Install Node.js**  
   Download and install Node.js from [nodejs.org](https://nodejs.org/) (recommended: LTS version).

2. **Clone the repository**  
   Open a terminal and run:
   ```bash
   git clone https://github.com/colorimgugr/spectral_visualizer_front.git
   cd spectral_visualizer_front

3. **Install the dependencies**
   ```bash
   npm install

3. **Start the development server**
   ```bash
   npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app locally.

### 🚀 Deployment
Deploy to Vercel with a single click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/colorimgs-projects/multispectral-visualizer)

The deployment is automatically launch one you do a push in github, it will take a minute to start. The status should be as Ready

## License
Distributed under the MIT License. See LICENSE.txt for more information.

---

## 🖼️ Part 2: Image Structure & Artwork Data

This project uses **OpenSeaDragon**, which requires image tiles in a specific format. Here’s how to prepare your artwork data and imagery.

### 🗂️ Folder structure
All images and artwork metadata are placed inside the public/artworks/ folder. Each artwork must have its own folder, named with its artwork ID. Th
  ```bash
    public/
    └── artworks/
        └── artwork123/
            ├── RGB/
            │   └── visible/
            │       └── image.dzi
            ├── MSI/
            │   └── vnir/
            │       ├── 450nm.png
            │       └── 550nm.png
            └── artwork123.json
  ```
👉 You can find the official types and classes in the [types.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/types.ts) file.

### 🧾 How to prepare and add images
1. Create a folder inside public/artworks/ with your artwork ID.
2. Inside that folder, create subfolders for RGB, Mono, MSI, or HSI as needed.
3. Follow the rules for each image type:
     For Mono and RGB:
         Convert the .png image to DZI format using libvips (must be installed):
               vips dzsave input.png output-name
      This command will produce:
           a .dzi file
           a folder with image tiles
   when using vips dzsave, images may appear rotated if the original image contains EXIF orientation metadata (common in images from cameras or phones). By default, vips may not respect or apply that orientation.

	To fix this and ensure the Deep Zoom tiles are exported with the correct visual orientation, you can use the autorotate operation before saving.
	vips autorot: applies the EXIF orientation tag (if any) and saves the correctly rotated image.
	Then vips dzsave generates the tiles from that corrected image.
		vips autorot image-name.png temp-image.png && vips dzsave temp-image.png output-folder

     For MSI and HSI:
           Add .png files named with the wavelength:
               450nm.png, 550nm.png, 680nm.png

### 🧪 How to update artwork metadata
After placing the images:

Henerate the ts file with the metadata by running the following Python script in the project root:
  ```bash
  python build_spectral_file.py
  ```
It'll generate a file in the src/app/resources/artowrks/[id]. Here you can manually edit the artwork metadata. It will also going to add the arwork to the [allArtworks.ts](https://github.com/colorimgugr/spectral_visualizer_front/blob/main/src/app/resources/allArtworks.ts) 

In case you want to temporary remove 

### 🗃️ Important files & folders

File / Folder	Purpose
public/artworks/	All images and their structure go here.
build_spectral_file.py	Python script to build or update metadata for artworks.
src/app/resources/types.ts	Definitions of image types and spectral bands.
src/app/resources/	Contains editable configs, constants, and metadata helpers. (You can specify the content of these later.)
