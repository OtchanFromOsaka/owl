import { useState } from "hono/jsx";
import type { YouTubeVideo } from "../types/youtube";
import {
	formatUploadDate,
	formatViewCount,
	getYouTubeVideoUrl,
	formatLocalTime,
	type LocalTimeInfo,
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
							<p class="text-gray-600 mb-2">{video.channelName}</p>
							
							{/* 現地時間を最も目立つ位置に配置 */}
							{video.uploadDate && video.timezone && video.timezoneOffset && (() => {
								const localTime = formatLocalTime(video.uploadDate, video.timezone, video.timezoneOffset);
								return (
									<div class="mb-3 flex items-center font-medium">
										<span class="text-blue-700 bg-blue-50 px-2 py-1 rounded-md flex items-center">
											{localTime.isDaytime ? (
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="currentColor" />
												</svg>
											)}
											現地時間: {localTime.timeString}
										</span>
									</div>
								);
							})()}
							
							{/* 視聴回数と公開日時を下部に配置 */}
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
