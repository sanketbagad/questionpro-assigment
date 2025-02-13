import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { GroceryItem } from "./GroceryItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user!: User;

  @ManyToMany(() => GroceryItem, { cascade: true })
  @JoinTable()
  items!: GroceryItem[];

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  orderDate!: Date;
}
