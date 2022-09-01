// 게시글 관련 인풋데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createCollectionReq = {
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: Array,
}

const sampleBaseReq_1 = {
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: Array,
}

const sampleBaseReq_2 = {
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: Array,
}

const sampleBaseReq_3 = {
    category_id: "101",
    collectionTitle: "또 듣고 싶은 신나는 음악",
    description: "또 듣고 싶은 신나는 음악입니다.",
    videos: Array,
}

module.exports = {
    createCollectionReq,
    sampleBaseReq_1,
    sampleBaseReq_2,
    sampleBaseReq_3,
}