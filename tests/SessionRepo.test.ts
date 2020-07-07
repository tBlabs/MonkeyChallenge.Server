import { SessionRepository } from "../src/Persistance/Repository";
import { Database } from "../src/Persistance/Database";
import { DateTimeProvider } from "../src/Services/DateTimeProvider/DateTimeProvider";

describe(SessionRepository.name, () =>
{
    it('should work', async () => 
    {
        // Given
        const db = new Database();
        await db.Init();
        const sut = new SessionRepository(db, new DateTimeProvider());
        await sut.Init();

        await sut.Drop();

        // When
        await sut.AddSession("TestMonkey1", 1000, 1);
        await sut.AddSession("TestMonkey1", 2000, 2);

        // Then
        const result = await sut.GetLastTotals("TestMonkey1", 10);

        expect(result.length).toBe(1);
        expect(result[0].SessionsCount).toBe(2);
        expect(result[0].TotalDuration).toBe(3000);
        expect(result[0].TotalPullups).toBe(3);
    });
});