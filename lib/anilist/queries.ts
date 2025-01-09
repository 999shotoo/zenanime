
export const trending = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (sort :TRENDING_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            description
            bannerImage
            episodes
            status
            duration
            genres
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              trailer {
                id
                site
                thumbnail
              }
        }
    }
}`

export const top100anime = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (sort :FAVOURITES_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            episodes
            status
            duration
            genres
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
        }
    }
}`


export const popular = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (sort :POPULARITY_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            episodes
            status
            duration
            genres
            description
            bannerImage
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
        }
    }
}`

export const seasonal = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (season: SPRING, seasonYear: 2024,sort :POPULARITY_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            episodes
            status
            duration
            genres
            season
            format
            description
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
        }
    }
}`

export const Malid = `
query ($id: Int) {
    Media(id: $id) {
        id
        idMal
    }
}
`

export const animeinfo = `
query ($id: Int) {
    Media(id: $id) {
    id
    idMal
    title {
      userPreferred
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description
    hashtag
    tags {
      id
      name
      description
      rank
    }
    type
    format
    status
    season
    seasonYear
    episodes
    duration
    genres
    source
    isAdult
    isLicensed
    countryOfOrigin
    meanScore
    averageScore
    popularity
    favourites
    rankings {
      id
      rank
      type
      format
      year
      season
    }
    nextAiringEpisode {
      id
      airingAt
      timeUntilAiring
      episode
    }
    streamingEpisodes {
      site
      title
      thumbnail
      url
    }
    trailer {
      id
      site
      thumbnail
    }
    externalLinks {
      site
      url
      type
    }
    characters {
      edges {
        id
        role
        node {
          id
          name {
            first
            last
            full
            native
            userPreferred
          }
          image {
            large
            medium
          }
        }
      }
    }
    staff {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          languageV2
          image {
            large
          }
        }
      }
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
  }
  }
`

export const advancedsearch = `
query ($page: Int = 1, $id: Int, $type: MediaType, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $episodeLesser: Int, $episodeGreater: Int, $genres: [String], $tags: [String], $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 30) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, genre_in: $genres, tag_in: $tags, sort: $sort) {
      id
      title {
        english
        romaji
        userPreferred
      }
      coverImage {
        extraLarge
        large
        color
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      bannerImage
      season
      seasonYear
      description
      type
      format
      status(version: 2)
      episodes
      duration
      chapters
      volumes
      genres
      isAdult
      averageScore
      popularity
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      mediaListEntry {
        id
        status
      }
    }
  }
}`;


export const notifications = `query ($page: Int) {
  Page(page: $page, perPage: 15) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    notifications(resetNotificationCount: true) {
			... on AiringNotification {
				id
				type 
				animeId
				episode
				contexts
				createdAt
				media: media {
					id
					title {
             english
          romaji 
        }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on RelatedMediaAdditionNotification {
				id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaDataChangeNotification {
					id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaMergeNotification {
        id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaDeletionNotification {
        id
				type
				context
				createdAt
        deletedMediaTitle
			}
	  	}
	}
}`

export const playeranimeinfo = `query ($id: Int) {
  Media (id: $id) {
    mediaListEntry {
      progress
      status
    }
    id
    idMal
    title {
      romaji
      english
      native
    }
    status
    format
    genres
    episodes
    bannerImage
    description
    coverImage {
      extraLarge
      color
    }
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    recommendations {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
          episodes
          status
          format
          nextAiringEpisode {
            episode
          }
        }
      }
    }
  }
}
`

export const userlists = `
query ($id: Int) {
  Media(id: $id) {
    mediaListEntry {
      id
      status
      score
      progress
      repeat
      notes
      startedAt{
        year 
        month
        day
      }
      completedAt{
        year 
        month
        day
      }
    }
  }
}
`;

export const updatelist = `
mutation (
  $id: Int,
  $mediaId: Int!,
  $progress: Int,
  $status: MediaListStatus,
  $score: Float,
  $notes: String,
  $startedAt: FuzzyDateInput,
  $completedAt: FuzzyDateInput,
  $repeat: Int
) {
  SaveMediaListEntry (
    id: $id,
    mediaId: $mediaId,
    status: $status,
    score: $score,
    progress: $progress,
    notes: $notes,
    startedAt: $startedAt,
    completedAt: $completedAt,
    repeat: $repeat
  ) {
    id
    mediaId
    status
    score
    notes
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    progress
    repeat
  }
}
`

export const userprofile = `
query ($username: String, $status: MediaListStatus) {
  MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
    user {
      id
      name
      about (asHtml: true)
      createdAt
      avatar {
          large
      }
      statistics {
        anime {
            count
            episodesWatched
            minutesWatched
            meanScore
        }
    }
      bannerImage
    }
    lists {
      status
      name
      entries {
        id
        mediaId
        status
      score
      progress
      repeat
      notes
      startedAt{
        year 
        month
        day
      }
      completedAt{
        year 
        month
        day
      }
        updatedAt
        media {
          id
          status
          format
          title {
            english
            romaji
          }
          episodes
          bannerImage
          coverImage {
            extraLarge
          }
        }
      }
    }
  }
}
`

export const schedule = ` 
query($page: Int, $perPage: Int, $from: Int, $to: Int){
  Page(page: $page, perPage: $perPage){
    pageInfo{
      hasNextPage
    },
    airingSchedules(airingAt_greater: $from, airingAt_lesser: $to){
      episode,
      timeUntilAiring,
      airingAt,
      media{
        title
        coverImage{
          extraLarge
        }
        bannerImage
        format,
        status,
        episodes
      }
    }
  }
}`


export const Recommendations = `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              recommendations(sort: RATING_DESC) {
                nodes {
                  mediaRecommendation {
                    id
                    title {
                      userPreferred
                    }
                    coverImage {
                      medium
                    }
                    format
                    episodes
                    status
                  }
                }
              }
            }
          }
        `;

