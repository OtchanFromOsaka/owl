export interface YouTubeVideo {
	id: string;
	title: string;
	channelName: string;
	viewCount?: number;
	uploadDate?: string;
	thumbnailUrl: string;
}

export interface YouTubeFeedProps {
	videos: YouTubeVideo[];
}
