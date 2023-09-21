import { DataLoadType } from "@domain/data-load.type";
import { ITweet } from "@domain/tweet.interface";

export interface ITweetImgViewing {
  tweet: ITweet<DataLoadType.EAGER_LOADED>;
  img: string;
}
