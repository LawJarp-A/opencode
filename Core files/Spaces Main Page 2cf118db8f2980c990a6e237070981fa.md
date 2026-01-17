# Spaces Main Page

## 1. Overview

Spaces are the primary way users access capabilities in ShopOS.

However, as the number of Spaces grows (including enterprise-specific ones), users struggle to:

- Discover all available Spaces
- Understand what each Space does
- Find the right Space for their intent
- Navigate curated or custom Spaces (Enterprise)

This product note introduces a **Dedicated Spaces Page**, accessible from the **Side Navigation / Home Page**, that functions as:

> A browsable, searchable catalog of all Spaces available to the user.
> 

This page becomes the **primary discovery surface** for Spaces.

### Figma links:

Nudges to Spaces from Home page: [https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=264-3069&t=BU0GP9EMQbv8UiIC-4](https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=264-3069&t=BU0GP9EMQbv8UiIC-4)

Space Module Main Page: [https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=276-5392&t=BU0GP9EMQbv8UiIC-4](https://www.figma.com/design/QXxYfdwkILA3s2eeeMtMCp/Spaces-V3?node-id=276-5392&t=BU0GP9EMQbv8UiIC-4)

## 2. Problem Statement

Users report that:

- Spaces are hard to discover beyond what’s immediately visible
- It’s unclear what each Space does without clicking into it
- There is no way to search, filter, or sort Spaces

As ShopOS we are restricted because:

- All Spaces appear equal - no signal for beta or experimental spaces to see
- Enterprise users cannot see their custom or curated Spaces distinctly

This leads to:

- Low feature adoption
- Use of the same few Spaces
- Using certain spaces for what they are not supposed to be used for
- Poor onboarding for new users

## 3. User Stories / Use Cases

- As a user, I want to browse all available Spaces in one place, so I can **discover functionality** I didn’t know existed
- As a user, I want to **search,** **filter and sort Spaces**, so I can narrow down options to those most relevant to my current project
- As an enterprise user, I want to see my brand’s **custom Spaces** grouped separately, so I can access them without clutter
- As a user, I want to know which **Spaces are in beta**, so I can opt in knowingly or set appropriate expectations for their performance and stability

## 4. Key Functionality and Requirements

### 4.1 Dedicated “Spaces” Page

- Access Point:
    - Side Nav → Spaces
    - Nudge at the end of the Homepage
- Displays all Spaces available to the user, including:

### 4.2 Space Information Display

Each space entry on the page will clearly display:

- Space Name
- Short description of what it does
- Output Type (Image/Video/Text)
- Status Tag →
- Preview → representative image showing an example output from the space

### 4.3 Space Search

Search bar at the top of the spaces page allowing users to search by:

- Space name
- Keywords within the space description
- Associated Tags

**Real-time Results:** Search results should update in real-time as the user types

### 4.4 Filters (*to confirm if needed now)*

Users can filter Spaces by output type:

- Images
- Videos
- Text

Filters should be:

- Multi-select
- Sticky during session
- Clearly resettable

### 4.5 Beta Spaces

Some Spaces are still experimental and should be marked clearly.

Requirements:

- Beta badge visible on Space card
- Tooltip or secondary text explaining:
    
    > “This Space is in beta and may produce inconsistent results”
    > 

Purpose:

- Set correct expectations
- Encourage exploration without overpromising

### 4.6 Enterprise → Custom Spaces

Enterprise users may have **custom or curated Spaces** that are not available globally.

Requirements:

- Enterprise Spaces must be visible **only to eligible users (certain users within Enterprise)**
- Can appear: In the same Spaces page with a “Customer Spaces” badge (E.g., Agilitas Spaces, Hamley’s Spaces)
- Do not show → the custom spaces for other users who are not eligible (these can be Enterprise, Pro or Tier)

This allows:

- Personalization without fragmenting the product
- Clear separation between global vs brand-specific capabilities

### 4.7 Sort *(Future scope)*

### 4.8 Favourite *(Future scope)*

### 4.9 Know More about a Space

- Users when they click on a space will be able to see
    - About the space
    - Best for
    - Not good for
    - Templates of the space
- 

Qs:

1. This will be available in a publicly available link - API onto wordpress - *future*
2. Admin panel - later; for now devs will handle
3. 

## 5. Acceptance Criteria

1. “Spaces” appears in side nav and loads within 200ms.
2. Search returns relevant Spaces with fuzzy matching.
3. Filters update results within 100ms of interaction.
4. Beta, Image, Video and Text badges display correctly on Space cards.
5. Launch button on each card opens the correct Space form immediately.
6. Custom Spaces surfaces only for enterprise-flagged brands.

## 6. Analytics

- spaces_page_viewed
- space_searched (search term, result count)
- space_filtered (filter categories, result count)
- space_selected (Space ID, source: directory vs. slash command)

### Spaces

### ShopOS Spaces Directory v2.1

| # | Space Name | Subheading |
| --- | --- | --- |
| 1 | **Fashion Studio** | Get a pro studio look for your clothing items. |
| 2 | **Product Studio** | Clean, professional studio shots for any object. |
| 3 | **Fashion Lifestyle** | Place your apparel in a real-world setting. |
| 4 | **Product Scenery** | Put your product in a lifestyle environment. |
| 5 | **Model Swap** | Change the model or product on an existing photo. |
| 6 | **Size Guide** | Overlay dimensions to show how big it is. |
| 7 | **Info Card** | Turn product facts into a visual infographic. |
| 8 | **Fabric Zoom** | Show off the texture and material details close up. |
| 9 | **Feature Highlight** | Point out the specific selling points of your item. |
| 10 | **Versus Mode** | visually compare your product against others. |
| 11 | **Virtual Try-On** | Dress a digital model in multiple items at once. |
| 12 | **Product Clip** | Turn a still photo into a moving product video. |
| 13 | **360 Spin** | Create a rotating view so customers see every angle. |
| 14 | **Vibe Video** | Animate your product in a lifestyle scene. |
| 15 | **Product Story** | Write a description that actually sells the item. |
| 16 | **Key Benefits** | Summarize the best features in a bulleted list. |
| 17 | **Smart Title** | Generate a catchy, SEO-friendly name for your product. |
| 18 | **Auto Tagger** | Automatically generate search tags for your catalog. |
| 19 | **HD Boost** | Make images sharp enough to print or zoom. |
| 20 | **Ad Spot** | Create a high-energy promotional video. |
| 21 | **Social Reel** | Make a vertical video tailored for TikTok and Reels. |
| 22 | **Social Post** | Create a standard square graphic for your feed. |
| 23 | **Website Hero** | Design a wide, stunning banner for your homepage. |
| 24 | **Ad Headline** | Write the perfect hook for your paid ads. |
| 25 | **Insta Caption** | Generate engaging copy for your social posts. |
| 26 | **Holiday Theme** | Dress up your product image for the holidays. |
| 27 | **Combo Deal** | Show off a package deal or set in one image. |
| 28 | **Moodboard** | visualize a scene or style with a storyboard. |
| 29 | **Store Poster** | Design a vertical banner for digital displays. |
| 30 | **Season Banner** | Big visuals for your seasonal sales campaigns. |
| 31 | **Photo Collage** | Mix multiple lifestyle shots into one layout. |
| 32 | **Offer Banner** | Promote a special discount with a wide header. |
| 33 | **Print Ready** | Super-size your image for physical printing. |
| 34 | **Background Remover** | Instantly isolate your product on a transparent layer. |
| 35 | **New Backdrop** | Swap the existing background for something else. |
| 36 | **Light Fixer** | Brighten up dark shadows or fix exposure. |
| 37 | **Texture Pop** | Bring out the gritty details and sharpness. |
| 38 | **Resizer** | Change the shape of your image to fit any screen. |
| 39 | **Angle Adjust** | Shift the camera perspective of your shot. |
| 40 | **Magic Eraser** | Remove dust, scratches, and imperfections. |
| 41 | **Color Grade** | Adjust the mood, warmth, and tone of the photo. |
| 42 | **Discount Sticker** | Slap a sale badge or tag on your product image. |
| 43 | **Watermarker** | Stamp your logo to protect your visual assets. |
| 44 | **Zoom Enhance** | Crop in close without losing any quality. |
| 45 | **Sketch to Product** | Turn a rough drawing into a realistic product photo. |
| 46 | **Subject Lines** | Write email headers that get people to open. |
| 47 | **Unblur** | Fix missed focus and sharpen the subject. |
| 48 | **Skin Retouch** | Make skin realistic and remove the AI smoothness out. |
| 49 | **Editorial Spread** | Create a high-fashion lookbook layout. |
| 50 | **Review Card** | Turn customer testimonials into shareable graphics. |
| 51 | **Swipeable Ad** | Create a multi-slide carousel story. |
| 52 | **Jewelry Shot** | Specialized lighting for gems and accessories. |
| 53 | **Shop The Look** | Break down an outfit into purchasable items. |
| 54 | **Logo Maker** | Generate a brand new logo concept from scratch. |
| 55 | **UGC Frame** | Place your product in user-generated style content. |
| 56 | **AI Video Gen** | Generate a creative video from a text prompt. |
| 57 | **Video Notes** | Add text overlays and pointers to your video. |

### Spaces - How It Works Content for public spaces

### ShopOS Spaces Directory v2.1

| # | Space Name | Subheading |  |
| --- | --- | --- | --- |
| 1 | **Fashion Studio** | Get a pro studio look for your clothing items. |  |
| 2 | **Product Studio** | Clean, professional studio shots for any object. | Turn any product into polished, studio-quality visuals in minutes.
1. Define: Upload a photo of your object and describe the desired aesthetic, background, or lighting style
2. Analyze: The system identifies product geometry, materials, and surface details to ensure accurate representation.
3. Stage: System selects backgrounds, lighting styles, and shadows to match your brand or marketplace requirements.
4. Enhance: The AI corrects color, sharpness, reflections, and proportions for a premium studio finish.
5. Visualize: Preview multiple compositions and variations, optimized for web, ads, and catalogs.
6. Create: Export high-resolution, ready-to-use product images without the cost or time of a physical studio. |
| 3 | **Fashion Lifestyle** | Place your apparel in a real-world setting. | Turn flat apparel shots into compelling lifestyle visuals.
1. Upload: Add your apparel image or product cutout.
2. Analyze: The system detects garment structure, fabric behavior, and fit characteristics.
3. Style: Choose environments, poses, models, and lighting that match your brand aesthetic.
4. Compose: The AI realistically maps the garment onto the scene with correct scale, drape, and perspective.
5. Enhance: Lighting, shadows, and color are adjusted to blend naturally into the environment.
6. Create: Export high-impact lifestyle images ready for campaigns, lookbooks, and product pages. |
| 4 | **Product Scenery** | Put your product in a lifestyle environment. |  |
| 5 | **Model Swap** | Change the model or product on an existing photo. |  |
| 6 | **Size Guide** | Overlay dimensions to show how big it is. |  |
| 7 | **Info Card** | Turn product facts into a visual infographic. |  |
| 8 | **Fabric Zoom** | Show off the texture and material details close up. |  |
| 9 | **Feature Highlight** | Point out the specific selling points of your item. |  |
| 10 | **Versus Mode** | visually compare your product against others. |  |
| 11 | **Virtual Try-On** | Dress a digital model in multiple items at once. |  |
| 12 | **Product Clip** | Turn a still photo into a moving product video. |  |
| 13 | **360 Spin** | Create a rotating view so customers see every angle. |  |
| 14 | **Vibe Video** | Animate your product in a lifestyle scene. |  |
| 15 | **Product Story** | Write a description that actually sells the item. |  |
| 16 | **Key Benefits** | Summarize the best features in a bulleted list. |  |
| 17 | **Smart Title** | Generate a catchy, SEO-friendly name for your product. |  |
| 18 | **Auto Tagger** | Automatically generate search tags for your catalog. |  |
| 19 | **HD Boost** | Make images sharp enough to print or zoom. |  |
| 20 | **Ad Spot** | Create a high-energy promotional video. |  |
| 21 | **Social Reel** | Make a vertical video tailored for TikTok and Reels. |  |
| 22 | **Social Post** | Create a standard square graphic for your feed. |  |
| 23 | **Website Hero** | Design a wide, stunning banner for your homepage. |  |
| 24 | **Ad Headline** | Write the perfect hook for your paid ads. |  |
| 25 | **Insta Caption** | Generate engaging copy for your social posts. |  |
| 26 | **Holiday Theme** | Dress up your product image for the holidays. |  |
| 27 | **Combo Deal** | Show off a package deal or set in one image. |  |
| 28 | **Moodboard** | visualize a scene or style with a storyboard. |  |
| 29 | **Store Poster** | Design a vertical banner for digital displays. |  |
| 30 | **Season Banner** | Big visuals for your seasonal sales campaigns. |  |
| 31 | **Photo Collage** | Mix multiple lifestyle shots into one layout. |  |
| 32 | **Offer Banner** | Promote a special discount with a wide header. |  |
| 33 | **Print Ready** | Super-size your image for physical printing. |  |
| 34 | **Background Remover** | Instantly isolate your product on a transparent layer. | Remove backgrounds cleanly and accurately in seconds.
1. Upload: Add your product image in any common format.
2. Detect: The AI automatically identifies the product edges and subject boundaries.
3. Separate: The background is removed while preserving fine details like shadows and contours.
4. Refine: Edge smoothing and cleanup are applied for a natural, professional look.
5. Preview: Instantly review the result or test it on new backgrounds.
6. Export: Download a clean, transparent image ready for eCommerce, ads, or design workflows. |
| 35 | **New Backdrop** | Swap the existing background for something else. |  |
| 36 | **Light Fixer** | Brighten up dark shadows or fix exposure. |  |
| 37 | **Texture Pop** | Bring out the gritty details and sharpness. |  |
| 38 | **Resizer** | Change the shape of your image to fit any screen. |  |
| 39 | **Angle Adjust** | Shift the camera perspective of your shot. |  |
| 40 | **Magic Eraser** | Remove dust, scratches, and imperfections. |  |
| 41 | **Color Grade** | Adjust the mood, warmth, and tone of the photo. |  |
| 42 | **Discount Sticker** | Slap a sale badge or tag on your product image. |  |
| 43 | **Watermarker** | Stamp your logo to protect your visual assets. |  |
| 44 | **Zoom Enhance** | Crop in close without losing any quality. |  |
| 45 | **Sketch to Product** | Turn a rough drawing into a realistic product photo. |  |
| 46 | **Subject Lines** | Write email headers that get people to open. |  |
| 47 | **Unblur** | Fix missed focus and sharpen the subject. |  |
| 48 | **Skin Retouch** | Make skin realistic and remove the AI smoothness out. |  |
| 49 | **Editorial Spread** | Create a high-fashion lookbook layout. |  |
| 50 | **Review Card** | Turn customer testimonials into shareable graphics. |  |
| 51 | **Swipeable Ad** | Create a multi-slide carousel story. |  |
| 52 | **Jewelry Shot** | Specialized lighting for gems and accessories. |  |
| 53 | **Shop The Look** | Break down an outfit into purchasable items. |  |
| 54 | **Logo Maker** | Generate a brand new logo concept from scratch. |  |
| 55 | **UGC Frame** | Place your product in user-generated style content. |  |
| 56 | **AI Video Gen** | Generate a creative video from a text prompt. |  |
| 57 | **Video Notes** | Add text overlays and pointers to your video. |  |

### Copy for spaces “more info”

@AJAY PV @Jovil @Tapan Rai : QA this once and get this live for “more info” on spaces

Vibe coded reference:

[](https://ai.studio/apps/drive/1fQ2izYfDCgdrns79PJnEiAqvJG5yI1aC?fullscreenApplet=true)

Reference for depth of info:

[ChatGPT Apps | Browse and chat with your favorite apps in ChatGPT](https://chatgpt.com/apps)

![image.png](Spaces%20Main%20Page/image.png)

![image.png](Spaces%20Main%20Page/image%201.png)

[response.md](Spaces%20Main%20Page/response.md)