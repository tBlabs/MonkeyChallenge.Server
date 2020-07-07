import { SessionRepository } from "../src/Persistance/SessionRepository";
import { Database } from "../src/Persistance/Database";
import { IDateTimeProvider } from "../src/Services/DateTimeProvider/DateTimeProvider";
import { Mock } from "moq.ts";

describe(SessionRepository.name, () =>
{
    it('should work', async () => 
    {
        // Given
        const db = new Database();
        await db.Init();
        const dt = new Mock<IDateTimeProvider>();
        dt.setup(x => x.Now).returns(new Date(2000, 0, 1, 12, 0, 0));
        const sut = new SessionRepository(db, dt.object());
        await sut.Init();

        await sut.Drop();

        // When
        await sut.AddSession("TestMonkey1", 1000, 1);
        await sut.AddSession("TestMonkey1", 2000, 2);

        // Then
        const result = await sut.GetLastTotals("TestMonkey1", 10);

        expect(result.length).toBe(1);
        expect(result[0].Date).toEqual(new Date(2000, 0, 1, 2, 0, 0));
        expect(result[0].SessionsCount).toBe(2);
        expect(result[0].TotalDuration).toBe(3000);
        expect(result[0].TotalPullups).toBe(3);
    });
});