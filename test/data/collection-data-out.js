// 컬렉션 관련 아웃풋 데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createCollectionRes = {
  message: "컬렉션이 생성되었습니다.",
};

const deleteCollectionRes = {
  message: "컬렉션을 삭제하였습니다.",
};

const getCollectionsRes = {
  data: [
    {
      _id: "630f30fa71d6081b5c178ecf",
      user_id: "630dca1e5b60fec023bd6c6c",
      category_id: "101",
      collectionTitle: "또 듣고 싶은 신나는 음악",
      description: "또 듣고 싶은 신나는 음악입니다.",
      videos: {
        0: "p9HjZshdjt4",
        1: "iAVFk3Hv5K0",
        2: "37Mmd4rUwGk",
        3: "cGhGtKnKZbY",
      },
      likes: 12,
      createdAt: "2022-08-30T08:28:14.357+00:00",
    },
    {
      _id: "630f30fa71d6081b5c178ed1",
      user_id: "63004dfa1759949daf48394b",
      category_id: "104",
      collectionTitle: "갬성 터지는 음악",
      description: "갬성 터지는 음악 너무 좋아요",
      videos: {
        0: "n61ULEU7CO0",
        1: "cMHXFKAN6Dk",
        2: "vYLyyuQByBc",
        3: "e_e1WMNFiHc",
      },
      likes: 4,
      createdAt: "2022-08-30T07:02:22.737+00:00",
    },
  ],
};

const getCollectionsResAscending = {
  data: [
    {
      _id: "630f30fa71d6081b5c178ed1",
      user_id: "63004dfa1759949daf48394b",
      category_id: "104",
      collectionTitle: "갬성 터지는 음악",
      description: "갬성 터지는 음악 너무 좋아요",
      videos: {
        0: "n61ULEU7CO0",
        1: "cMHXFKAN6Dk",
        2: "vYLyyuQByBc",
        3: "e_e1WMNFiHc",
      },
      likes: 4,
      createdAt: "2022-08-30T07:02:22.737+00:00",
    },
    {
      _id: "630f30fa71d6081b5c178ecf",
      user_id: "630dca1e5b60fec023bd6c6c",
      category_id: "101",
      collectionTitle: "또 듣고 싶은 신나는 음악",
      description: "또 듣고 싶은 신나는 음악입니다.",
      videos: {
        0: "p9HjZshdjt4",
        1: "iAVFk3Hv5K0",
        2: "37Mmd4rUwGk",
        3: "cGhGtKnKZbY",
      },
      likes: 12,
      createdAt: "2022-08-30T08:28:14.357+00:00",
    },
  ],
};

const getCollectionDetailRes = {
  data: {
    _id: "630f30fa71d6081b5c178ecf",
    user_id: "630dca1e5b60fec023bd6c6c",
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: {
        0: "p9HjZshdjt4",
        1: "iAVFk3Hv5K0",
        2: "37Mmd4rUwGk",
        3: "cGhGtKnKZbY",
      },
    likes: 12,
    createdAt: "2022-08-30T08:28:14.357+00:00",
  },
};

const getCollectionDetailRes_otherWriter = {
  data: {
    _id: "630f30fa71d6081b5c178ed1",
    user_id: "63004dfa1759949daf48394b",
    category_id: "104",
    collectionTitle: "갬성 터지는 음악",
    description: "갬성 터지는 음악 너무 좋아요",
    videos: {
        0: "n61ULEU7CO0",
        1: "cMHXFKAN6Dk",
        2: "vYLyyuQByBc",
        3: "e_e1WMNFiHc",
      },
    likes: 4,
    createdAt: "2022-08-30T07:02:22.737+00:00",
  },
};

const createdCollectionRes = {
  data: {
    _id: "630f30fa71d6081b5c178ecf",
    user_id: "630dca1e5b60fec023bd6c6c",
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: {
        0: "p9HjZshdjt4",
        1: "iAVFk3Hv5K0",
        2: "37Mmd4rUwGk",
        3: "cGhGtKnKZbY",
      },
    likes: 12,
    createdAt: "2022-08-30T08:28:14.357+00:00",
  },
};

const getlikedCollectionsRes = {
  data: [
    {
      _id: "630f30fa71d6081b5c178ed1",
      user_id: "63004dfa1759949daf48394b",
      category_id: "104",
      collectionTitle: "갬성 터지는 음악",
      description: "갬성 터지는 음악 너무 좋아요",
      videos: {
        0: "n61ULEU7CO0",
        1: "cMHXFKAN6Dk",
        2: "vYLyyuQByBc",
        3: "e_e1WMNFiHc",
      },
      likes: 4,
      createdAt: "2022-08-30T07:02:22.737+00:00",
    },
    {
      _id: "630f30fa71d6081b5c178ecf",
      user_id: "630dca1e5b60fec023bd6c6c",
      category_id: "101",
      collectionTitle: "또 듣고 싶은 신나는 음악",
      description: "또 듣고 싶은 신나는 음악입니다.",
      videos: {
        0: "p9HjZshdjt4",
        1: "iAVFk3Hv5K0",
        2: "37Mmd4rUwGk",
        3: "cGhGtKnKZbY",
      },
      likes: 12,
      createdAt: "2022-08-30T08:28:14.357+00:00",
    },
  ],
};

const likeCollectionRes = {
    message: "해당 컬렉션을 좋아요하였습니다.",
}

const dislikeCollectionRes = {
    message: "해당 컬렉션을 좋아요 취소하였습니다.",
}

module.exports = {
    createCollectionRes,
    deleteCollectionRes,
    getCollectionsRes,
    getCollectionsResAscending,
    getCollectionDetailRes,
    getCollectionDetailRes_otherWriter,
    createdCollectionRes,
    getlikedCollectionsRes,
    likeCollectionRes,
    dislikeCollectionRes,
}