import { User, UserRole } from "../../models/User";

describe("User Entity", () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.email = "testuser@example.com";
    user.password = "password123";
    user.role = UserRole.USER;
  });

  it("should create a new User with correct properties", () => {
    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe("testuser@example.com");
    expect(user.password).toBe("password123");
    expect(user.role).toBe(UserRole.USER);
  });

  it("should have a default role of 'user'", () => {
    const defaultUser = new User();
    expect(defaultUser.role).toBe(UserRole.USER);
  });
});
