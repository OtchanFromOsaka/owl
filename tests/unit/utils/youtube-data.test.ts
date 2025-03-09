import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
	fetchYouTubeVideos,
	formatViewCount,
	formatUploadDate,
	getYouTubeVideoUrl,
} from "../../../app/utils/youtube-data";

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

describe("fetchYouTubeVideos", () => {
	it("should fetch videos successfully", async () => {
		// モックデータ
		const mockVideos = [
			{
				id: "test1",
				title: "Test Video 1",
				channelName: "Test Channel",
				thumbnailUrl: "https://example.com/thumb1.jpg",
			},
		];

		// fetchをモック化
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({ videos: mockVideos }),
		});

		const result = await fetchYouTubeVideos();
		expect(result).toEqual(mockVideos);
		expect(fetch).toHaveBeenCalledWith("/data/bird-nest-videos.json");
	});

	it("should handle fetch errors", async () => {
		// エラーを返すfetchをモック化
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
		});

		// console.errorをモック化
		console.error = vi.fn();

		const result = await fetchYouTubeVideos();
		expect(result).toEqual([]);
		expect(console.error).toHaveBeenCalled();
	});

	it("should handle JSON parsing errors", async () => {
		// JSONエラーを返すfetchをモック化
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
		});

		// console.errorをモック化
		console.error = vi.fn();

		const result = await fetchYouTubeVideos();
		expect(result).toEqual([]);
		expect(console.error).toHaveBeenCalled();
	});
});
