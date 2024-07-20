import { create } from "zustand"

type State = {
    id: number
    isOpen: boolean
    openSheet: (id?: number) => void
    closeSheet: () => void
}

const useEditAccount = create<State>((set) => ({
    id: 0,
    isOpen: false,
    openSheet: (id) => set(() => ({ isOpen: true, id: id ?? 0 })),
    closeSheet: () => set(() => ({ isOpen: false, id: 0 }))
}));

export default useEditAccount;