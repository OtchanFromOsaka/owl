import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
	fetchYouTubeVideos,
	formatViewCount,
	formatUploadDate,
	getYouTubeVideoUrl,
	formatLocalTime,
} from "../../../app/utils/youtube-data";
import { birdNestVideos } from "../../../app/data/videos";

describe("formatViewCount", () => {
	it("should format view count less than 1000", () => {
		expect(formatViewCount(500)).toBe("500 views");
	});

	it("should format view count in thousands", () => {
		expect(formatViewCount(1500)).toBe("1.5K views");
		expect(formatViewCount(15000)).toBe("15.0K views");
	});

	it("should format view count in millions", () => {
		expect(formatViewCount(1500000)).toBe("1.5M views");
		expect(formatViewCount(15000000)).toBe("15.0M views");
	});
});

describe("formatUploadDate", () => {
	// すべてのテストで固定の参照日付を使用する: 2025-03-09
	const REFERENCE_DATE = "2025-03-09";

	it("should return 'Today' for today's date", () => {
		expect(formatUploadDate("2025-03-09", REFERENCE_DATE)).toBe("Today");
	});

	it("should return 'Yesterday' for yesterday's date", () => {
		expect(formatUploadDate("2025-03-08", REFERENCE_DATE)).toBe("Yesterday");
	});

	it("should return days ago for dates less than a week ago", () => {
		expect(formatUploadDate("2025-03-05", REFERENCE_DATE)).toBe("4 days ago");
	});

	it("should return weeks ago for dates less than a month ago", () => {
		expect(formatUploadDate("2025-02-20", REFERENCE_DATE)).toBe("2 weeks ago");
	});

	it("should return months ago for dates less than a year ago", () => {
		expect(formatUploadDate("2024-12-09", REFERENCE_DATE)).toBe("3 months ago");
	});

	it("should return years ago for dates more than a year ago", () => {
		expect(formatUploadDate("2023-03-09", REFERENCE_DATE)).toBe("2 years ago");
	});
});

describe("getYouTubeVideoUrl", () => {
	it("should generate correct YouTube video URL", () => {
		expect(getYouTubeVideoUrl("abc123")).toBe(
			"https://www.youtube.com/watch?v=abc123",
		);
	});
});

describe("formatLocalTime", () => {
	// Date.prototype.toLocaleTimeStringをモックする
	const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
	
	beforeEach(() => {
		// テスト用に固定の時間文字列を返すようにモックする
		Date.prototype.toLocaleTimeString = vi.fn().mockImplementation(
			function(locale, options) {
				if (options?.hour12 === false) {
					// 時間のみを返す場合（hour12: false）
					if (options?.timeZone === "America/Los_Angeles") {
						return "12";
					}
					return "21";
				}
				
				// 通常の時間文字列を返す場合
				if (options?.timeZone === "America/Los_Angeles") {
					return "12:00";
				}
				return "21:00";
			}
		);
	});
	
	afterEach(() => {
		// テスト後に元の実装に戻す
		Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
	});

	it("should format local time with timezone abbreviation for Los Angeles", () => {
		const result = formatLocalTime(
			"2021-09-16",
			"America/Los_Angeles",
			"-07:00"
		);
		expect(result.timeString).toBe("12:00（PDT）");
		expect(result.isDaytime).toBe(true);
		expect(result.hour).toBe(12);
	});
	
	it("should format local time with timezone abbreviation for Tokyo", () => {
		const result = formatLocalTime(
			"2021-09-16",
			"Asia/Tokyo",
			"+09:00"
		);
		expect(result.timeString).toBe("21:00（JST）");
		expect(result.isDaytime).toBe(false);
		expect(result.hour).toBe(21);
	});
	
	it("should return default values if timezone or offset is missing", () => {
		const defaultResult = formatLocalTime("2021-09-16");
		expect(defaultResult.timeString).toBe("");
		expect(defaultResult.isDaytime).toBe(true);
		expect(defaultResult.hour).toBe(12);
		
		expect(formatLocalTime("2021-09-16", "America/Los_Angeles").timeString).toBe("");
		expect(formatLocalTime("2021-09-16", undefined, "-07:00").timeString).toBe("");
	});
	
	it("should handle unknown timezones by using UTC offset", () => {
		const result = formatLocalTime(
			"2021-09-16",
			"Unknown/Timezone",
			"+05:30"
		);
		expect(result.timeString).toBe("21:00（UTC+05:30）");
		expect(result.isDaytime).toBe(false);
		expect(result.hour).toBe(21);
	});
});

describe("fetchYouTubeVideos", () => {
	it("should return videos from the TypeScript module", async () => {
		const result = await fetchYouTubeVideos();
		expect(result).toEqual(birdNestVideos);
	});

	it("should handle errors and return empty array", async () => {
		// モジュールインポートでエラーが発生した場合をシミュレート
		vi.spyOn(console, "error").mockImplementation(() => {});
		
		// 一時的にbirdNestVideosへのアクセスでエラーを発生させる
		const originalImport = await import("../../../app/data/videos");
		const mockError = new Error("Module import error");
		
		// モジュールのプロパティアクセスでエラーを投げるようにする
		Object.defineProperty(originalImport, "birdNestVideos", {
			get: () => { throw mockError; }
		});
		
		const result = await fetchYouTubeVideos();
		expect(result).toEqual([]);
		expect(console.error).toHaveBeenCalled();
		
		// モックをリセット
		vi.spyOn(console, "error").mockRestore();
	});
});
