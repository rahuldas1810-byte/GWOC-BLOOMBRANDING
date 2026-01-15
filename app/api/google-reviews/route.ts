
import { NextResponse } from 'next/server';
import SiteSettings from '@/models/SiteSettings';
import dbConnect from '@/lib/db';
import { unstable_cache } from 'next/cache';

// Cache configuration
const CACHE_TAG = 'google-reviews';
const REVALIDATE_TIME = 21600; // 6 hours in seconds

export async function GET() {
    try {
        // 1. Connect to DB and check SiteSettings
        await dbConnect();
        const settings = await SiteSettings.findOne({});

        // If setting is disabled, return empty array immediately (triggers fallback on client/server fetcher)
        if (settings && settings.useGoogleReviews === false) {
            return NextResponse.json({ success: true, data: [] });
        }

        // 2. Fetch from Google (cached)
        const reviews = await getCachedGoogleReviews();

        return NextResponse.json({ success: true, data: reviews });

    } catch (error) {
        console.error('Error in google-reviews route:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error', data: [] }, { status: 500 });
    }
}

// Cached function to fetch from Google
const getCachedGoogleReviews = unstable_cache(
    async () => {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const placeId = process.env.GOOGLE_PLACE_ID;

        if (!apiKey || !placeId) {
            console.warn('Google Places API keys missing');
            return [];
        }

        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=en`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok || !data.result) {
                console.error('Google Places API Error:', data.error_message || response.statusText);
                return [];
            }

            const reviews = data.result.reviews || [];

            // 3. Filter & Sort
            const filteredReviews = reviews
                .filter((review: any) => review.rating >= 4) // Rating >= 4
                .sort((a: any, b: any) => b.rating - a.rating) // Highest rating first
                .slice(0, 5) // Limit to 5
                .map((review: any) => ({
                    id: `google-${review.time}`, // Create a unique ID
                    quote: truncateText(review.text, 200),
                    clientName: review.author_name,
                    company: "Google Review", // As requested
                    image: review.profile_photo_url,
                    createdAt: new Date(review.time * 1000).toISOString(),
                    rating: review.rating
                }));

            return filteredReviews;
        } catch (e) {
            console.error('Network error fetching Google Reviews:', e);
            return [];
        }
    },
    [CACHE_TAG],
    { revalidate: REVALIDATE_TIME, tags: [CACHE_TAG] }
);

function truncateText(text: string, maxLength: number) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}
