export interface YouTubeVideo {
	id: string;
	title: string;
	channelName: string;
	viewCount?: number;
	uploadDate?: string;
	thumbnailUrl: string;
	timezone?: string; // タイムゾーン識別子（例：'America/Los_Angeles'）
	timezoneOffset?: string; // UTCからのオフセット（例：'-08:00'）
}

export interface YouTubeFeedProps {
	videos: YouTubeVideo[];
}
