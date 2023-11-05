const CHANNELS = {
  "UCjLEmnpCNeisMxy134KPwWw": "Kobo Kanaeru",
  "UCTvHWSfBZgtxE4sILOaurIQ": "Vestia Zeta",
  "UCZLZ8Jjx_RN2CXloOmgTHVg": "Kaela Kovalskia",
}

function main() {
  const lastPageToken = "" // usefull if you want to skip page

  for (const id of [
    "UCjLEmnpCNeisMxy134KPwWw",
    "UCTvHWSfBZgtxE4sILOaurIQ",
    "UCZLZ8Jjx_RN2CXloOmgTHVg",
  ]) {
    fetch(id, lastPageToken)
  }
}

function fetch(channelId, pageToken = "") {
  console.log("[search page]", channelId, pageToken)

  const result = YouTube.Search.list(["snippet"], {
    channelId,
    order: "date",
    type: "video",
    maxResults: 50,
    pageToken,
  })

  for (const item of result.items) {
    const videoDetail = YouTube.Videos.list(['liveStreamingDetails'], {
      id: item.id.videoId,
    }).items.shift()

    if (videoDetail && videoDetail.liveStreamingDetails) {
      const scheduled = videoDetail.liveStreamingDetails.scheduledStartTime
      const actual = videoDetail.liveStreamingDetails.actualStartTime

      const sheet = SpreadsheetApp.getActiveSheet();
      sheet.appendRow([
        channelId,
        CHANNELS[channelId],
        item.id.videoId,
        item.snippet.title,
        scheduled,
        actual,
        (new Date(actual) - new Date(scheduled)) / 1000,
      ])
    }
  }

  if (result.nextPageToken) {
    fetch(channelId, result.nextPageToken)
  }
}
