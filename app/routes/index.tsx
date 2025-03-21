import { createRoute } from "honox/factory";
import YouTubeFeed from "../islands/youtube-feed";
import { fetchYouTubeVideos } from "../utils/youtube-data";
import type { YouTubeVideo } from "../types/youtube";

export default createRoute(async (c) => {
	let videos: YouTubeVideo[] = [];

	try {
		// 実際のアプリケーションでは、これをサーバーサイドで取得する
		// このデモでは、コンポーネント内でクライアントサイドで取得する
		// これはサーバーサイド実装のためのプレースホルダーです
		videos = await fetchYouTubeVideos();
	} catch (error) {
		console.error("Error fetching videos:", error);
	}

	return c.render(
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<title>Codename: Owl</title>
			<header class="text-center mb-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-2">Codename: Owl</h1>
				<p class="text-xl text-gray-600">
					Discover fascinating bird nest videos from around the world
				</p>
			</header>

			<section>
				<h2 class="text-2xl font-semibold mb-4">Recommended Videos</h2>
				<YouTubeFeed videos={videos} />
			</section>
		</div>,
	);
});
