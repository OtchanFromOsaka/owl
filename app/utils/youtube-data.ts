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
 * @param date 日付文字列（YYYY-MM-DD形式）
 * @param timezone タイムゾーン識別子（例：'America/Los_Angeles'）
 * @param timezoneOffset UTCからのオフセット（例：'-08:00'）
 * @returns 現地時間の文字列（例：「午前10:30（PT）」）
 */
export const formatLocalTime = (
	date: string,
	timezone?: string,
	timezoneOffset?: string,
): string => {
	if (!timezone || !timezoneOffset) {
		return "";
	}

	try {
		// タイムゾーン略称を取得する
		const tzAbbr = getTimezoneAbbreviation(timezone, timezoneOffset);
		
		// 日付文字列を解析する（時間部分がない場合は正午を使用）
		const dateObj = new Date(`${date}T12:00:00${timezoneOffset}`);
		
		// 現地時間の文字列を作成する
		const timeString = dateObj.toLocaleTimeString("ja-JP", {
			hour: "numeric",
			minute: "numeric",
			timeZone: timezone,
		});
		
		return `${timeString}（${tzAbbr}）`;
	} catch (error) {
		console.error("Error formatting local time:", error);
		return "";
	}
};

/**
 * タイムゾーン識別子とオフセットから略称を取得する
 * @param timezone タイムゾーン識別子
 * @param offset UTCからのオフセット
 * @returns タイムゾーン略称
 */
const getTimezoneAbbreviation = (timezone: string, offset: string): string => {
	// 一般的なタイムゾーン略称のマッピング
	const timezoneMap: Record<string, { std: string; dst: string }> = {
		"America/Los_Angeles": { std: "PST", dst: "PDT" },
		"America/Denver": { std: "MST", dst: "MDT" },
		"America/Chicago": { std: "CST", dst: "CDT" },
		"America/New_York": { std: "EST", dst: "EDT" },
		"Europe/London": { std: "GMT", dst: "BST" },
		"Europe/Paris": { std: "CET", dst: "CEST" },
		"Asia/Tokyo": { std: "JST", dst: "JST" }, // 日本は夏時間を採用していない
	};

	// タイムゾーンマッピングが存在する場合
	if (timezone in timezoneMap) {
		// 夏時間かどうかを判断する（簡易的な方法）
		const isDST = offset.includes("-07:00") || offset.includes("-06:00") || 
					  offset.includes("-05:00") || offset.includes("-04:00") ||
					  offset.includes("+02:00") || offset.includes("+03:00");
		
		return isDST ? timezoneMap[timezone].dst : timezoneMap[timezone].std;
	}

	// マッピングがない場合はUTCオフセットを返す
	return `UTC${offset}`;
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
