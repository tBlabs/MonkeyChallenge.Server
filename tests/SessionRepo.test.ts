import { SessionRepository } from "../src/Persistance/SessionRepository";
import { Database } from "../src/Persistance/Database";
import { IDateTimeProvider } from "../src/Services/DateTimeProvider/DateTimeProvider";
import { Mock } from "moq.ts";
import { SessionEntity } from "../src/Persistance/Entities/SessionEntity";

describe(SessionRepository.name, () =>
{
    const db = new Database();
    const dt = new Mock<IDateTimeProvider>();
    let sut: SessionRepository;

    beforeAll(async () =>
    {
        await db.Init();
    });

    beforeEach(async () =>
    {
        dt.setup(x => x.Now).returns(new Date(2000, 0, 15, 12, 0, 0));

        sut = new SessionRepository(db, dt.object());
        await sut.Init();

        await sut.Drop();
    });

    it('should count daily total', async () => 
    {
        // When
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 10, 12, 0, 0), 1000, 1));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 10, 12, 0, 0), 2000, 2));

        // Then
        const result = await sut.GetLastTotals("TestMonkey1", 10);

        expect(result.length).toBe(1);
        expect(result[0].Date).toEqual(new Date(2000, 0, 10, 2, 0, 0));
        expect(result[0].SessionsCount).toBe(2);
        expect(result[0].TotalDuration).toBe(3000);
        expect(result[0].TotalPullups).toBe(3);
    });

    it('should count daily total for few days', async () => 
    {
        // When
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 10, 12, 0, 0), 1000, 1));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 11, 12, 0, 0), 1000, 1));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 11, 12, 10, 0), 2000, 2));

        // Then
        const result = await sut.GetLastTotals("TestMonkey1", 10);

        expect(result.length).toBe(2);
        expect(result[0].Date).toEqual(new Date(2000, 0, 10, 2, 0, 0));
        expect(result[0].SessionsCount).toBe(1);
        expect(result[0].TotalDuration).toBe(1000);
        expect(result[0].TotalPullups).toBe(1);
        expect(result[1].Date).toEqual(new Date(2000, 0, 11, 2, 0, 0));
        expect(result[1].SessionsCount).toBe(2);
        expect(result[1].TotalDuration).toBe(3000);
        expect(result[1].TotalPullups).toBe(3);
    });

    it('should filter by monkey id', async () =>
    {
        // When
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 10, 12, 0, 0), 1000, 1));
        await sut.AddSession(new SessionEntity("TestMonkey2", new Date(2000, 0, 10, 12, 0, 0), 2000, 2));

        // Then
        const result = await sut.GetLastTotals("TestMonkey2", 10);

        expect(result.length).toBe(1);
        expect(result[0].Date).toEqual(new Date(2000, 0, 10, 2, 0, 0));
        expect(result[0].SessionsCount).toBe(1);
        expect(result[0].TotalDuration).toBe(2000);
        expect(result[0].TotalPullups).toBe(2);
    });

    it('should not filter sessions from out of range', async () =>
    {
        // When
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 15, 12, 0, 0), 1000, 1));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 14, 12, 0, 0), 2000, 2));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 13, 12, 0, 0), 3000, 3));
        await sut.AddSession(new SessionEntity("TestMonkey1", new Date(2000, 0, 12, 12, 0, 0), 4000, 4));

        // Then
        const result = await sut.GetLastTotals("TestMonkey1", 3);

        expect(result.length).toBe(3);
        expect(result[0].Date).toEqual(new Date(2000, 0, 15, 2, 0, 0));
        expect(result[1].Date).toEqual(new Date(2000, 0, 14, 2, 0, 0));
        expect(result[2].Date).toEqual(new Date(2000, 0, 13, 2, 0, 0));
    });
});