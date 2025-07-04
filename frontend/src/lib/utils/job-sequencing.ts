import { AppointmentSchema } from "../types/appointment/appointment.types";

class MinHeap<T> {
    private heap: { val: number; item: T }[];

    constructor() {
        this.heap = [];
    }

    push(val: number, item: T): void {
        this.heap.push({ val, item });
        this.heapifyUp();
    }

    pop(): { val: number; item: T } | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const top = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown();
        return top;
    }

    top(): { val: number; item: T } | undefined {
        return this.heap.length > 0 ? this.heap[0] : undefined;
    }

    size(): number {
        return this.heap.length;
    }

    values(): T[] {
        return this.heap.map(entry => entry.item);
    }

    private heapifyUp(): void {
        let idx = this.heap.length - 1;
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            if (this.heap[parent].val <= this.heap[idx].val) break;
            [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
            idx = parent;
        }
    }

    private heapifyDown(): void {
        let idx = 0;
        while (2 * idx + 1 < this.heap.length) {
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;
            let smallest = left;

            if (right < this.heap.length && this.heap[right].val < this.heap[left].val) {
                smallest = right;
            }

            if (this.heap[idx].val <= this.heap[smallest].val) break;

            [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
            idx = smallest;
        }
    }
}

interface ScheduleResult {
    scheduled: AppointmentSchema[];
    totalProfit: number;
    scheduledIds: string[];
    maxPossibleProfit: number;
}

export function scheduleAppointments(appointments: AppointmentSchema[]): ScheduleResult {
    // Filter only appointments that haven't been responded to yet
    const notResponded = appointments.filter(app => app.requestStatus === "not-responded");
    
    if (notResponded.length === 0) {
        return {
            scheduled: [],
            totalProfit: 0,
            scheduledIds: [],
            maxPossibleProfit: 0
        };
    }

    // Calculate deadline slots and filter out expired appointments
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today for accurate day comparison
    
    const jobs = notResponded
        .filter(app => {
            const deadlineDate = new Date(app.deadline);
            deadlineDate.setHours(0, 0, 0, 0); // Set to start of deadline day
            return deadlineDate >= now; // Keep only appointments with future or today deadlines
        })
        .map(app => {
            const deadlineDate = new Date(app.deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            const daysFromNow = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            
            return {
                ...app,
                deadlineSlot: daysFromNow
            };
        })
        .sort((a, b) => a.deadlineSlot - b.deadlineSlot); // Sort by deadline (earliest first)

    if (jobs.length === 0) {
        return {
            scheduled: [],
            totalProfit: 0,
            scheduledIds: [],
            maxPossibleProfit: 0
        };
    }

    // Use min-heap to maintain the least profitable jobs in our current selection
    const minHeap = new MinHeap<AppointmentSchema>();

    // Job scheduling algorithm with deadline constraints
    for (const job of jobs) {
        if (minHeap.size() < job.deadlineSlot) {
            // We have available time slots, so add this job
            minHeap.push(job.offeredPrice, job);
        } else if (minHeap.top() && minHeap.top()!.val < job.offeredPrice) {
            // Replace the least profitable job with this more profitable one
            minHeap.pop();
            minHeap.push(job.offeredPrice, job);
        }
    }

    // Extract results
    const scheduled = minHeap.values();
    const totalProfit = scheduled.reduce((acc, app) => acc + app.offeredPrice, 0);
    const scheduledIds = scheduled.map(app => app._id);
    
    // Calculate theoretical maximum if we could take all jobs (ignoring deadlines)
    const maxPossibleProfit = notResponded.reduce((acc, app) => acc + app.offeredPrice, 0);

    return {
        scheduled,
        totalProfit,
        scheduledIds,
        maxPossibleProfit
    };
}

// Helper function to get appointment details by ID
export function getAppointmentById(appointments: AppointmentSchema[], id: string): AppointmentSchema | undefined {
    return appointments.find(app => app._id === id);
}

// Helper function to check if an appointment deadline has passed
export function isAppointmentExpired(appointment: AppointmentSchema): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(appointment.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < now;
}

// Helper function to check if an appointment can be scheduled given current date
export function canScheduleAppointment(appointment: AppointmentSchema): boolean {
    return !isAppointmentExpired(appointment) && appointment.requestStatus === "not-responded";
}

// Example usage and testing function
export function testScheduling(appointments: AppointmentSchema[]): void {
    const result = scheduleAppointments(appointments);
    const expiredCount = appointments.filter(isAppointmentExpired).length;
    
    console.log("=== APPOINTMENT SCHEDULING RESULTS ===");
    console.log(`Total appointments: ${appointments.length}`);
    console.log(`Expired appointments (filtered out): ${expiredCount}`);
    console.log(`Not-responded appointments: ${appointments.filter(a => a.requestStatus === "not-responded").length}`);
    console.log(`Valid appointments for scheduling: ${appointments.filter(canScheduleAppointment).length}`);
    console.log(`Scheduled appointments: ${result.scheduled.length}`);
    console.log(`Total profit: ${result.totalProfit}`);
    console.log(`Max possible profit (no deadline constraints): ${result.maxPossibleProfit}`);
    console.log(`Efficiency: ${result.maxPossibleProfit > 0 ? ((result.totalProfit / result.maxPossibleProfit) * 100).toFixed(1) : 0}%`);
    
    console.log("\n=== SCHEDULED APPOINTMENTS ===");
    result.scheduled
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .forEach((app, index) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(app.deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            console.log(`${index + 1}. ID: ${app._id}`);
            console.log(`   Price: ${app.offeredPrice}`);
            console.log(`   Deadline: ${app.deadline.toISOString().split('T')[0]} (${daysUntilDeadline} days)`);
            console.log(`   Time Required: ${app.timeRequired} hours`);
            console.log(`   Customer: ${app.customerId}`);
            console.log("");
        });
    
    // Show expired appointments if any
    const expiredAppointments = appointments.filter(isAppointmentExpired);
    if (expiredAppointments.length > 0) {
        console.log("\n=== EXPIRED APPOINTMENTS (FILTERED OUT) ===");
        expiredAppointments.forEach((app, index) => {
            console.log(`${index + 1}. ID: ${app._id} - Deadline: ${app.deadline.toISOString().split('T')[0]} - Price: ${app.offeredPrice}`);
        });
    }
}