# Subscription Plan Image Download

This documentation explains how to use the provided commands to download or copy images for subscription plans.

## Commands Available

- `plans:update-images` - Updates existing subscription plans with predefined images
- `plans:download-images` - Downloads images from external APIs based on plan keywords (requires API keys)
- `plans:download-default-images` - Downloads default images from stable Pexels image URLs
- `plans:copy-local-images` - Copies images from your local public folder (recommended & most reliable)

## API Configuration (Optional)

To use the `plans:download-images` command with API integration, you need to configure API keys for either Unsplash or Pexels (or both).

Add the following variables to your `.env` file:

```
# Unsplash API (https://unsplash.com/developers)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
UNSPLASH_SECRET_KEY=your_unsplash_secret_key_here

# Pexels API (https://www.pexels.com/api/)
PEXELS_API_KEY=your_pexels_api_key_here
```

## Using the Commands

### 1. Copy Local Images (RECOMMENDED APPROACH)

This is the most reliable method and doesn't require internet access or API keys. It copies images from your `public/assets/images/classes` directory to the storage location:

```bash
php artisan plans:copy-local-images
```

Make sure you have images with the correct names in your public folder (`juz-amma.jpg`, `half-quran.jpg`, etc.).

### 2. Download Default Images

This command will download a set of default images from stable Pexels URLs:

```bash
php artisan plans:download-default-images
```

Add the `--force` option to redownload images even if they already exist:

```bash
php artisan plans:download-default-images --force
```

### 3. Download Images from APIs

If you've configured the API keys, you can use this command to search for and download more specific images:

```bash
php artisan plans:download-images
```

This command will:
- Search Unsplash or Pexels for images using keywords related to each plan type
- Download and save the images to the storage
- Update the subscription plans with the new image paths

### 4. Update Existing Plans with Images

This command will associate predefined image paths with the existing subscription plans:

```bash
php artisan plans:update-images
```

## Storage Structure

Images are stored in the following location:
- Path: `storage/app/public/assets/images/classes/`
- Public URL: `/assets/images/classes/`

After downloading images, you need to create a storage link:

```bash
php artisan storage:link
```

## Troubleshooting

If you encounter issues:

1. **Most reliable method**: Use the `plans:copy-local-images` command after adding images to your public folder
2. If using download commands, check your internet connection
3. Ensure you have valid API keys configured in your `.env` file (if using API methods)
4. Check that the storage directory is writable
5. Verify you have the proper file permissions
6. Create a symbolic link with `php artisan storage:link`
7. Clear cache with `php artisan optimize:clear`

## Default Image Types

The following default images are used:

- `juz-amma.jpg` - For Juz' Amma related plans
- `half-quran.jpg` - For Half Quran related plans
- `full-quran.jpg` - For Full Quran related plans
- `tajweed-basics.jpg` - For Tajweed Basics related plans
- `advanced-tajweed.jpg` - For Advanced Tajweed related plans
- `islamic-studies.jpg` - For Islamic Studies related plans
- `quranic-arabic.jpg` - For Quranic Arabic related plans
- `juz-amma-annual.jpg` - For annual Juz' Amma plans
- `full-quran-annual.jpg` - For annual Full Quran plans
- `default.jpg` - Default fallback image 