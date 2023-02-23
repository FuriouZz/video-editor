use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
enum Asset {
    Video {
        filename: String,
        video: Vec<u8>,
        frames: Vec<Vec<u8>>,
    },
    Image {
        filename: String,
        video: Vec<u8>,
    },
    Audio {
        filename: String,
        video: Vec<u8>,
    },
}

pub fn upload_asset(asset: Asset) {
    match asset {
        Asset::Video {
            filename,
            video,
            frames,
        } => {}
        _ => {}
    }
}
