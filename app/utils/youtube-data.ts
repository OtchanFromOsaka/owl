import type { YouTubeVideo } from "../types/youtube";
import { birdNestVideos } from "../data/videos";

/**
 * TypeScriptモジュールからYouTubeビデオデータを取得する
 * @returns Promise<YouTubeVideo[]> YouTubeビデオの配列
 */
export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
	try {
		// 静的なTypeScriptデータを返す
		return birdNestVideos;
	} catch (error) {
		console.error("Error fetching YouTube videos:", error);
		return [];
	}
};

/**
 * 指定されたタイムゾーンでの現地時間を取得する
 * @param date 日付文字列（YYYY-MM-DD形式）- 使用されませんが、互換性のために残しています
 * @param timezone タイムゾーン識別子（例：'America/Los_Angeles'）
 * @param timezoneOffset UTCからのオフセット（例：'-08:00'）
 * @returns 現地時間の情報（時間文字列とアイコン情報）
 */
export interface LocalTimeInfo {
	timeString: string; // 時間文字列（例：「午前10:30（PT）」）
	isDaytime: boolean; // 昼間かどうか（6時〜18時）
	hour: number;       // 時間（0-23）
}

export const formatLocalTime = (
	date: string,
	timezone?: string,
	timezoneOffset?: string,
): LocalTimeInfo => {
	const defaultResult: LocalTimeInfo = {
		timeString: "",
		isDaytime: true,
		hour: 12
	};

	if (!timezone || !timezoneOffset) {
		return defaultResult;
	}

	try {
		// 現在の日時を取得する
		const now = new Date();
		
		// 現地時間の文字列を作成する
		const timeString = now.toLocaleTimeString("ja-JP", {
			hour: "numeric",
			minute: "numeric",
			timeZone: timezone,
		});
		
		// 時間を取得する（0-23）
		const hour = now.toLocaleTimeString("ja-JP", {
			hour: "numeric",
			hour12: false,
			timeZone: timezone,
		});
		
		// 時間を数値に変換
		const hourNum = parseInt(hour, 10);
		
		// 昼間かどうかを判断（6時〜18時）
		const isDaytime = hourNum >= 6 && hourNum < 18;
		
		return {
			timeString,
			isDaytime,
			hour: hourNum
		};
	} catch (error) {
		console.error("Error formatting local time:", error);
		return defaultResult;
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
