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
						</div>
						<div class="p-4">
							<h3 class="text-lg font-semibold line-clamp-2 mb-1">
								{video.title}
							</h3>
							<p class="text-gray-600 mb-2">{video.channelName}</p>
							{video.uploadDate && video.timezone && video.timezoneOffset && (() => {
								const localTime = formatLocalTime(video.uploadDate, video.timezone, video.timezoneOffset);
								return (
									<div class="mb-3 text-center">
										<div class="inline-block text-blue-700 bg-blue-50 px-3 py-1 rounded-md text-base font-medium">
											現地時間: {localTime.timeString}
											<span class="inline-block align-text-bottom ml-1">
												{localTime.isDaytime ? (
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 text-yellow-500 inline align-text-bottom" fill="none" stroke="currentColor">
														<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
													</svg>
												) : (
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 text-indigo-500 inline align-text-bottom" fill="none" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="currentColor" />
													</svg>
												)}
											</span>
										</div>
									</div>
								);
							})()}
							<div class="flex flex-col text-sm text-gray-500">
								<div class="flex">
									{video.viewCount && (
										<span class="mr-2">{formatViewCount(video.viewCount)}</span>
									)}
									{video.uploadDate && (
										<span>{formatUploadDate(video.uploadDate)}</span>
									)}
								</div>
							</div>
						</div>
					</a>
				</div>
			))}
		</div>
	);
}
