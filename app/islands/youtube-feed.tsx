import { useState } from "hono/jsx";
import type { YouTubeVideo } from "../types/youtube";
import {
	formatUploadDate,
	formatViewCount,
	getYouTubeVideoUrl,
	formatLocalTime,
} from "../utils/youtube-data";

interface YouTubeFeedProps {
	videos: YouTubeVideo[];
}

export default function YouTubeFeed({ videos }: YouTubeFeedProps) {
	const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

	return (
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
			{videos.map((video) => (
				<div
					key={video.id}
					class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
					onMouseEnter={() => setHoveredVideo(video.id)}
					onMouseLeave={() => setHoveredVideo(null)}
				>
					<a
						href={getYouTubeVideoUrl(video.id)}
						target="_blank"
						rel="noopener noreferrer"
						class="block"
					>
						<div class="relative">
							<img
								src={video.thumbnailUrl}
								alt={video.title}
								class="w-full h-48 object-cover"
								loading="lazy"
							/>
							{hoveredVideo === video.id && (
								<div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
									<div class="bg-red-600 text-white rounded-full p-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-labelledby="playIconTitle"
											role="img"
										>
											<title id="playIconTitle">Play Video</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
								</div>
							)}
						</div>
						<div class="p-4">
							<h3 class="text-lg font-semibold line-clamp-2 mb-1">
								{video.title}
							</h3>
							<p class="text-gray-600 mb-1">{video.channelName}</p>
							<div class="flex flex-col text-sm text-gray-500">
								<div class="flex">
									{video.viewCount && (
										<span class="mr-2">{formatViewCount(video.viewCount)}</span>
									)}
									{video.uploadDate && (
										<span>{formatUploadDate(video.uploadDate)}</span>
									)}
								</div>
								{video.uploadDate && video.timezone && video.timezoneOffset && (
									<div class="mt-1">
										<span class="text-blue-600">
											現地時間: {formatLocalTime(video.uploadDate, video.timezone, video.timezoneOffset)}
										</span>
									</div>
								)}
							</div>
						</div>
					</a>
				</div>
			))}
		</div>
	);
}
