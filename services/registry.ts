import { postsService } from "./posts/posts.service";
import { carsService } from "./cars/cars.service";

export const LikeableServices = {
  posts: postsService,
  cars: carsService,
  // აქ დაამატებ სხვებსაც: products: productsService და ა.შ.
} as const;

export type ServiceType = keyof typeof LikeableServices;
