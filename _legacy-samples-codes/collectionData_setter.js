require("dotenv").config(); // 환경변수 적용
const mongoose = require("mongoose");
const connect = require("../d_schemas/index.js");
connect();

const Collection = require("../d_schemas/collection.js");

const CollectionRepository = require("../c_repositories/collections.repository");
const collectionRepository = new CollectionRepository();

// 콜렉션 id & videos pair 모두 불러오기

const collectionSetter = async () => {
  const collections = await collectionRepository.getAllCollections();
  const id_videos_pair = collections.map((e) => {
    return { _id: e._id, videos: e.videos };
  });

  for (let i = 0; i < id_videos_pair.length; i++) {
    const video_ids = Array.from(new Set(id_videos_pair[i].videos));

    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: id_videos_pair[i]._id },
      { $set: { videos: video_ids } }
    );

    console.log(updatedCollection);
  }
};

collectionSetter();
