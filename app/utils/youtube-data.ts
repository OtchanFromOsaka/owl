import type { YouTubeVideo } from "../types/youtube";

/**
 * 静的JSONファイルからYouTubeビデオデータを取得する
 * @returns Promise<YouTubeVideo[]> YouTubeビデオの配列
 */
export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
	try {
		// 開発環境では完全なURLを使用する必要がある
		const baseUrl = typeof window !== "undefined" 
			? window.location.origin 
			: "http://localhost:5173";
		
		const response = await fetch(`${baseUrl}/data/bird-nest-videos.json`);
		if (!response.ok) {
			throw new Error(`Failed to fetch videos: ${response.status}`);
		}
		const data = await response.json() as { videos: YouTubeVideo[] };
		return data.videos;
	} catch (error) {
		console.error("Error fetching YouTube videos:", error);
		return [];
	}
};

/**
 * 視聴回数を読みやすい文字列にフォーマットする（例：1.2M、500K）
 * @param viewCount 視聴回数
 * @returns フォーマットされた視聴回数の文字列
 */
export const formatViewCount = (viewCount: number): string => {
	if (viewCount >= 1000000) {
		return `${(viewCount / 1000000).toFixed(1)}M views`;
	}
	if (viewCount >= 1000) {
		return `${(viewCount / 1000).toFixed(1)}K views`;
	}
	return `${viewCount} views`;
};

/**
 * アップロード日を読みやすい文字列にフォーマットする（例：「2ヶ月前」）
 * @param uploadDate YYYY-MM-DD形式の日付文字列
 * @param currentDateStr オプションのYYYY-MM-DD形式の現在日付文字列（テスト用）
 * @returns フォーマットされた日付文字列
 */
export const formatUploadDate = (
	uploadDate: string,
	currentDateStr?: string,
): string => {
	const uploadDateTime = new Date(uploadDate);
	const currentDateTime = currentDateStr
		? new Date(currentDateStr)
		: new Date();

	// 一貫した日付比較を確保するために時間部分をリセットする
	uploadDateTime.setHours(0, 0, 0, 0);
	currentDateTime.setHours(0, 0, 0, 0);

	// ミリ秒単位での差分を計算する
	const diffInMs = currentDateTime.getTime() - uploadDateTime.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	// 同じ日付かどうかを確認する
	if (diffInDays === 0) {
		return "Today";
	}

	// 昨日かどうかを確認する
	if (diffInDays === 1) {
		return "Yesterday";
	}

	// 数日前（1週間未満）
	if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	}

	// 数週間前（1ヶ月未満）
	if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	}

	// 数ヶ月前（1年未満）
	if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	}

	// 数年前
	const years = Math.floor(diffInDays / 365);
	return `${years} ${years === 1 ? "year" : "years"} ago`;
};

/**
 * ビデオIDからYouTubeビデオURLを生成する
 * @param videoId YouTubeビデオID
 * @returns YouTubeビデオURL
 */
export const getYouTubeVideoUrl = (videoId: string): string => {
	return `https://www.youtube.com/watch?v=${videoId}`;
};
