import { create } from "zustand";

type State = {
    isOpen: boolean
    openSheet: () => void
    closeSheet: () => void
}

const useOpenNewCategory = create<State>((set) => ({
    isOpen: false,
    openSheet: () => set(() => ({ isOpen: true })),
    closeSheet: () => set(() => ({ isOpen: false }))
}))

export default useOpenNewCategory;