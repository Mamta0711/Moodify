<?php
header('Content-Type: application/json');

$client_id = "19ef98583cc54ffeb453246471ef94f7";
$client_secret = "f1ad82cb2bf44734a7be026f880e3935";

$mood = isset($_GET['mood']) ? $_GET['mood'] : 'Happy';

$auth = base64_encode("$client_id:$client_secret");

$token_response = file_get_contents("https://accounts.spotify.com/api/token", false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Authorization: Basic $auth\r\nContent-Type: application/x-www-form-urlencoded",
        'content' => http_build_query(['grant_type' => 'client_credentials'])
    ]
]));

$token_data = json_decode($token_response, true);
$access_token = $token_data['access_token'] ?? null;

if (!$access_token) {
    echo json_encode(['error' => 'Failed to get token']);
    exit;
}

$search_url = "https://api.spotify.com/v1/search?q=" . urlencode("$mood mood") . "&type=playlist&limit=5";
$playlist_response = file_get_contents($search_url, false, stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer $access_token"
    ]
]));

$playlist_data = json_decode($playlist_response, true);
$items = $playlist_data['playlists']['items'] ?? [];

$valid_playlists = array_filter($items, function($playlist) {
    return !empty($playlist['id']);
});

if (count($valid_playlists) === 0) {
    echo json_encode(['error' => 'No valid playlist found']);
    exit;
}

$random_playlist = $valid_playlists[array_rand($valid_playlists)];
$playlist_id = $random_playlist['id'];


$tracks_response = file_get_contents("https://api.spotify.com/v1/playlists/$playlist_id/tracks", false, stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer $access_token"
    ]
]));

$track_data = json_decode($tracks_response, true);
$tracks = [];

foreach ($track_data['items'] as $item) {
    if (count($tracks) >= 10) break;

    $track = $item['track'];
    if (!$track) continue;
    if (empty($track['album']['images'])) continue;
    if (empty($track['name']) || empty($track['artists'][0]['name']) || empty($track['external_urls']['spotify'])) continue;

    $duration_ms = $track['duration_ms'] ?? 0;
    $minutes = floor($duration_ms / 60000);
    $seconds = str_pad(floor(($duration_ms % 60000) / 1000), 2, "0", STR_PAD_LEFT);
    $duration = "$minutes:$seconds";

    $tracks[] = [
        'name' => $track['name'],
        'artist' => $track['artists'][0]['name'],
        'album_cover' => $track['album']['images'][0]['url'],
        'duration' => $duration,
        'preview_url' => $track['preview_url'],
        'spotify_url' => $track['external_urls']['spotify']
    ];
}

echo json_encode(['playlist' => $tracks]);
exit;