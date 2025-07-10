export function getHoursAgo(postedAt: string | Date): string {
    const now = new Date();
    const created = new Date(postedAt);

    const diffInMs = now.getTime() - created.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    if (diffInSeconds < 60) {
        return "Just now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }
}

export function convertLinesToBulletPoints(
    text: string,
    maxWords: number = 14,
    addEllipsis: boolean = true
): string[] {
    if (!text) return [];

    const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean); // removes empty lines

    const result: string[] = [];
    let wordCount = 0;

    for (const line of lines) {
        const words = line.split(/\s+/); // handles multiple spaces
        const lineWordCount = words.length;

        if (wordCount + lineWordCount <= maxWords) {
            result.push(line);
            wordCount += lineWordCount;
        } else {
            const remaining = maxWords - wordCount;
            if (remaining > 0) {
                result.push(words.slice(0, remaining).join(' ') + (addEllipsis ? '...' : ''));
            }
            break;
        }
    }

    return result;
}




export function formatSalary(value: number): string {
    if (value >= 1e7) {
        // ₹1 Cr = 1 Crore = 10,000,000
        return `₹${(value / 1e7).toFixed(2)} CPA`;
    } else if (value >= 1e5) {
        // ₹1 Lakh = 100,000
        return `₹${(value / 1e5).toFixed(1)} LPA`;
    } else {
        // ₹1,000 = 1K
        return `₹${(value / 1e3).toFixed(0)}K`;
    }
}
